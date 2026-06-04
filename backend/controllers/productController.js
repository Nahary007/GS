"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const data_source_1 = require("../config/data-source");
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const Supplier_1 = require("../models/Supplier");
const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
const supplierRepository = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
const getAllProducts = async (req, res) => {
    try {
        const products = await productRepository.find({ relations: { category: true, supplier: true } });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productRepository.findOne({ where: { id }, relations: { category: true, supplier: true } });
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productRepository.findOneBy({ id });
        if (!product) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        const { categoryId, supplierId, ...updateData } = req.body;
        if (categoryId) {
            const category = await categoryRepository.findOneBy({ id: categoryId });
            if (category)
                product.category = category;
        }
        if (supplierId) {
            const supplier = await supplierRepository.findOneBy({ id: supplierId });
            if (supplier)
                product.supplier = supplier;
        }
        productRepository.merge(product, updateData);
        const results = await productRepository.save(product);
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await productRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: "Produit non trouvé" });
            return;
        }
        res.json({ message: "Produit supprimé avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map