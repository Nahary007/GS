"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const data_source_1 = require("../config/data-source");
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const Supplier_1 = require("../models/Supplier");
const typeorm_1 = require("typeorm");
const getDashboardStats = async (req, res) => {
    try {
        const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const categoryRepo = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const supplierRepo = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
        const totalProducts = await productRepo.count();
        const totalCategories = await categoryRepo.count();
        const totalSuppliers = await supplierRepo.count();
        // Products with stock <= minQuantity
        const lowStockProducts = await productRepo.find({
            where: { quantity: (0, typeorm_1.LessThanOrEqual)(10) }, // Or better, use a query builder if we want to compare column to column
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
    }
    catch (error) {
        console.error("Dashboard error", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboardController.js.map