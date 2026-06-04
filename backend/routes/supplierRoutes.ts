import { Router } from "express";
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from "../controllers/supplierController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Apply auth middleware to all supplier routes
router.use(authenticateToken);

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
