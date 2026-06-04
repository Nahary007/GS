"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply auth middleware to all stock routes
router.use(authMiddleware_1.authenticateToken);
router.get("/", stockController_1.getAllMovements);
router.post("/", stockController_1.createMovement);
exports.default = router;
//# sourceMappingURL=stockRoutes.js.map