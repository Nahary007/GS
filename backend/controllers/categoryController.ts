import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { StockMovement } from "../models/StockMovement";
import { In } from "typeorm";

const categoryRepository = AppDataSource.getRepository(Category);

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryRepository.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const category = await categoryRepository.findOneBy({ id });
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const newCategory = categoryRepository.create({ name, description });
        await categoryRepository.save(newCategory);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const category = await categoryRepository.findOneBy({ id });
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        categoryRepository.merge(category, req.body);
        const results = await categoryRepository.save(category);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        
        // Find all products in this category
        const productRepository = AppDataSource.getRepository(Product);
        const stockRepository = AppDataSource.getRepository(StockMovement);
        
        const products = await productRepository.find({ where: { category: { id } } });
        const productIds = products.map(p => p.id);
        
        if (productIds.length > 0) {
            // Delete stock movements for these products
            await stockRepository.delete({ product: { id: In(productIds) } });
            // Delete the products
            await productRepository.delete(productIds);
        }

        const result = await categoryRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        res.json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
