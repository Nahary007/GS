import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Supplier } from "../models/Supplier";
import { LessThanOrEqual } from "typeorm";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const productRepo = AppDataSource.getRepository(Product);
        const categoryRepo = AppDataSource.getRepository(Category);
        const supplierRepo = AppDataSource.getRepository(Supplier);

        const totalProducts = await productRepo.count();
        const totalCategories = await categoryRepo.count();
        const totalSuppliers = await supplierRepo.count();

        // Products with stock <= minQuantity
        const lowStockProducts = await productRepo.find({
            where: { quantity: LessThanOrEqual(10) }, // Or better, use a query builder if we want to compare column to column
            relations: { category: true }
        });
        
        // Accurate query to compare quantity <= minQuantity
        const criticalStockProducts = await productRepo.createQueryBuilder("product")
            .where("product.quantity <= product.minQuantity")
            .leftJoinAndSelect("product.category", "category")
            .getMany();

        const outOfStockProducts = await productRepo.find({
            where: { quantity: 0 },
            relations: { category: true }
        });

        res.json({
            totalProducts,
            totalCategories,
            totalSuppliers,
            criticalStockCount: criticalStockProducts.length,
            outOfStockCount: outOfStockProducts.length,
            criticalStockProducts,
            outOfStockProducts
        });
    } catch (error) {
        console.error("Dashboard error", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
