const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const ProductCategoryController = require("../controllers/ProductCategoryController");

router.post("/create-category",authMiddleware.authMiddleware, authMiddleware.isAdmin, ProductCategoryController.createCategory);
router.put("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, ProductCategoryController.updateCategory);
router.delete("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, ProductCategoryController.deleteCategory);
router.get("/:id", ProductCategoryController.getACategory);
router.get("/", ProductCategoryController.getAllCategory);
module.exports = router;