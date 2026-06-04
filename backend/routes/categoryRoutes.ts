import { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Apply auth middleware to all category routes
router.use(authenticateToken);

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
