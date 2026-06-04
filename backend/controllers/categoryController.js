"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const data_source_1 = require("../config/data-source");
const Category_1 = require("../models/Category");
const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.find();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoryRepository.findOneBy({ id });
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = categoryRepository.create({ name, description });
        await categoryRepository.save(newCategory);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoryRepository.findOneBy({ id });
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        categoryRepository.merge(category, req.body);
        const results = await categoryRepository.save(category);
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await categoryRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        res.json({ message: "Catégorie supprimée avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map