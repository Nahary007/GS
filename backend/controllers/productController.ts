import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Supplier } from "../models/Supplier";

const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);
const supplierRepository = AppDataSource.getRepository(Supplier);

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await productRepository.find({ relations: { category: true, supplier: true } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const product = await productRepository.findOne({ where: { id }, relations: { category: true, supplier: true } });
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, quantity, minQuantity, categoryId, supplierId } = req.body;
        
        const category = await categoryRepository.findOneBy({ id: categoryId });
        const supplier = await supplierRepository.findOneBy({ id: supplierId });
        
        if (!category || !supplier) {
            res.status(400).json({ message: "Catégorie ou Fournisseur invalide" });
            return;
        }

        const newProduct = productRepository.create({
            name,
            description,
            price,
            quantity: quantity !== undefined ? quantity : 0,
            minQuantity: minQuantity !== undefined ? minQuantity : 10,
            category,
            supplier
        });
        
        await productRepository.save(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const product = await productRepository.findOneBy({ id });
        
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }

        const { categoryId, supplierId, ...updateData } = req.body;
        
        if (categoryId) {
            const category = await categoryRepository.findOneBy({ id: categoryId });
            if (category) product.category = category;
        }
        if (supplierId) {
            const supplier = await supplierRepository.findOneBy({ id: supplierId });
            if (supplier) product.supplier = supplier;
        }

        productRepository.merge(product, updateData);
        const results = await productRepository.save(product);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const result = await productRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
