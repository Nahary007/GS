"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovement = exports.getAllMovements = void 0;
const data_source_1 = require("../config/data-source");
const StockMovement_1 = require("../models/StockMovement");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
const stockRepository = data_source_1.AppDataSource.getRepository(StockMovement_1.StockMovement);
const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
const getAllMovements = async (req, res) => {
    try {
        const movements = await stockRepository.find({ relations: { product: true, user: true }, order: { createdAt: "DESC" } });
        res.json(movements);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getAllMovements = getAllMovements;
const createMovement = async (req, res) => {
    try {
        const { productId, type, quantity, reason } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Non autorisé" });
            return;
        }
        if (!Object.values(StockMovement_1.MovementType).includes(type)) {
            res.status(400).json({ message: "Type de mouvement invalide" });
            return;
        }
        if (quantity <= 0) {
            res.status(400).json({ message: "La quantité doit être supérieure à 0" });
            return;
        }
        // Use transaction to ensure data integrity
        await data_source_1.AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const product = await transactionalEntityManager.findOne(Product_1.Product, { where: { id: productId } });
            if (!product) {
                throw new Error("Produit non trouvé");
            }
            const user = await transactionalEntityManager.findOne(User_1.User, { where: { id: userId } });
            if (!user) {
                throw new Error("Utilisateur non trouvé");
            }
            if (type === StockMovement_1.MovementType.OUT && product.quantity < quantity) {
                throw new Error("Stock insuffisant pour cette sortie");
            }
            // Update product quantity
            product.quantity = type === StockMovement_1.MovementType.IN
                ? product.quantity + quantity
                : product.quantity - quantity;
            await transactionalEntityManager.save(Product_1.Product, product);
            // Create movement record
            const movement = transactionalEntityManager.create(StockMovement_1.StockMovement, {
                product,
                user,
                type,
                quantity,
                reason
            });
            await transactionalEntityManager.save(StockMovement_1.StockMovement, movement);
        });
        res.status(201).json({ message: "Mouvement de stock enregistré avec succès" });
    }
    catch (error) {
        if (error.message === "Produit non trouvé" || error.message === "Stock insuffisant pour cette sortie") {
            res.status(400).json({ message: error.message });
        }
        else {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur lors de l'enregistrement du mouvement" });
        }
    }
};
exports.createMovement = createMovement;
//# sourceMappingURL=stockController.js.map