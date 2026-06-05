import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Supplier } from "../models/Supplier";
import { Product } from "../models/Product";
import { StockMovement } from "../models/StockMovement";
import { In } from "typeorm";

const supplierRepository = AppDataSource.getRepository(Supplier);

export const getAllSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await supplierRepository.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const supplier = await supplierRepository.findOneBy({ id });
        if (!supplier) {
            res.status(404).json({ message: "Fournisseur non trouvé" });
            return;
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createSupplier = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address } = req.body;
        const newSupplier = supplierRepository.create({ name, email, phone, address });
        await supplierRepository.save(newSupplier);
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const supplier = await supplierRepository.findOneBy({ id });
        if (!supplier) {
            res.status(404).json({ message: "Fournisseur non trouvé" });
            return;
        }
        supplierRepository.merge(supplier, req.body);
        const results = await supplierRepository.save(supplier);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        
        // Find all products from this supplier
        const productRepository = AppDataSource.getRepository(Product);
        const stockRepository = AppDataSource.getRepository(StockMovement);
        
        const products = await productRepository.find({ where: { supplier: { id } } });
        const productIds = products.map(p => p.id);
        
        if (productIds.length > 0) {
            // Delete stock movements for these products
            await stockRepository.delete({ product: { id: In(productIds) } });
            // Delete the products
            await productRepository.delete(productIds);
        }

        const result = await supplierRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: "Fournisseur non trouvé" });
            return;
        }
        res.json({ message: "Fournisseur supprimé avec succès" });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
