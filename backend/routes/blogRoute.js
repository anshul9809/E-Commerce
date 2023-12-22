const express = require("express");
const BlogController = require("../controllers/BlogController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadImages = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/create-blog", authMiddleware.authMiddleware, authMiddleware.isAdmin, BlogController.createBlog);
router.put("/upload/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, uploadImages.uploadPhoto.array('images', 2), uploadImages.blogImgResize, BlogController.uploadImages);
router.put("/like", authMiddleware.authMiddleware, BlogController.likeBlog);
router.put("/dislikes", authMiddleware.authMiddleware, BlogController.dislikeBlog);
router.put("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, BlogController.updateBlog);
router.get("/:id", BlogController.getBlog);
router.get("/", BlogController.getAllBlogs);
router.delete("/:id",authMiddleware.authMiddleware, authMiddleware.isAdmin, BlogController.deleteBlog);



module.exports = router;