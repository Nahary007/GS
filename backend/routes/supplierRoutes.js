"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierController_1 = require("../controllers/supplierController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply auth middleware to all supplier routes
router.use(authMiddleware_1.authenticateToken);
router.get("/", supplierController_1.getAllSuppliers);
router.get("/:id", supplierController_1.getSupplierById);
router.post("/", supplierController_1.createSupplier);
router.put("/:id", supplierController_1.updateSupplier);
router.delete("/:id", supplierController_1.deleteSupplier);
exports.default = router;
//# sourceMappingURL=supplierRoutes.js.map