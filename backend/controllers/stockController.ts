import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { StockMovement, MovementType } from "../models/StockMovement";
import { Product } from "../models/Product";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../models/User";

const stockRepository = AppDataSource.getRepository(StockMovement);
const productRepository = AppDataSource.getRepository(Product);

export const getAllMovements = async (req: Request, res: Response) => {
    try {
        const movements = await stockRepository.find({ relations: { product: true, user: true }, order: { createdAt: "DESC" } });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createMovement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId, type, quantity, reason } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Non autorisé" });
            return;
        }

        if (!Object.values(MovementType).includes(type)) {
            res.status(400).json({ message: "Type de mouvement invalide" });
            return;
        }

        if (quantity <= 0) {
            res.status(400).json({ message: "La quantité doit être supérieure à 0" });
            return;
        }

        // Use transaction to ensure data integrity
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const product = await transactionalEntityManager.findOne(Product, { where: { id: productId } });
            if (!product) {
                throw new Error("Produit non trouvé");
            }

            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new Error("Utilisateur non trouvé");
            }

            if (type === MovementType.OUT && product.quantity < quantity) {
                throw new Error("Stock insuffisant pour cette sortie");
            }

            // Update product quantity
            product.quantity = type === MovementType.IN 
                ? product.quantity + quantity 
                : product.quantity - quantity;
            
            await transactionalEntityManager.save(Product, product);

            // Create movement record
            const movement = transactionalEntityManager.create(StockMovement, {
                product,
                user,
                type,
                quantity,
                reason
            });
            await transactionalEntityManager.save(StockMovement, movement);
        });

        res.status(201).json({ message: "Mouvement de stock enregistré avec succès" });
    } catch (error: any) {
        if (error.message === "Produit non trouvé" || error.message === "Stock insuffisant pour cette sortie") {
            res.status(400).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur lors de l'enregistrement du mouvement" });
        }
    }
};
