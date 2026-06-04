"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply auth middleware to all product routes
router.use(authMiddleware_1.authenticateToken);
router.get("/", productController_1.getAllProducts);
router.get("/:id", productController_1.getProductById);
router.post("/", productController_1.createProduct);
router.put("/:id", productController_1.updateProduct);
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map