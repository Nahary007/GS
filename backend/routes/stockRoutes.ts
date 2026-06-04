import { Router } from "express";
import { getAllMovements, createMovement } from "../controllers/stockController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Apply auth middleware to all stock routes
router.use(authenticateToken);

router.get("/", getAllMovements);
router.post("/", createMovement);

export default router;
