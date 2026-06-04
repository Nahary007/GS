"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSupplierById = exports.getAllSuppliers = void 0;
const data_source_1 = require("../config/data-source");
const Supplier_1 = require("../models/Supplier");
const supplierRepository = data_source_1.AppDataSource.getRepository(Supplier_1.Supplier);
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierRepository.find();
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getAllSuppliers = getAllSuppliers;
const getSupplierById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const supplier = await supplierRepository.findOneBy({ id });
        if (!supplier) {
            res.status(404).json({ message: "Fournisseur non trouvé" });
            return;
        }
        res.json(supplier);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getSupplierById = getSupplierById;
const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const newSupplier = supplierRepository.create({ name, email, phone, address });
        await supplierRepository.save(newSupplier);
        res.status(201).json(newSupplier);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.createSupplier = createSupplier;
const updateSupplier = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const supplier = await supplierRepository.findOneBy({ id });
        if (!supplier) {
            res.status(404).json({ message: "Fournisseur non trouvé" });
            return;
        }
        supplierRepository.merge(supplier, req.body);
        const results = await supplierRepository.save(supplier);
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.updateSupplier = updateSupplier;
const deleteSupplier = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await supplierRepository.delete(id);
        if (result.affected === 0) {
            res.status(404).json({ message: "Fournisseur non trouvé" });
            return;
        }
        res.json({ message: "Fournisseur supprimé avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.deleteSupplier = deleteSupplier;
//# sourceMappingURL=supplierController.js.map