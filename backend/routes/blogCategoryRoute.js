const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const BlogCategoryController = require("../controllers/BlogCategoryController");


router.post("/create-category",authMiddleware.authMiddleware, authMiddleware.isAdmin, BlogCategoryController.createCategory);
router.put("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, BlogCategoryController.updateCategory);
router.delete("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, BlogCategoryController.deleteCategory);
router.get("/:id", BlogCategoryController.getACategory);
router.get("/", BlogCategoryController.getAllCategory);

module.exports = router;