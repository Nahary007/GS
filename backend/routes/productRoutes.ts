import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Apply auth middleware to all product routes
router.use(authenticateToken);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
