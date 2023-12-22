const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const ProductController = require("../controllers/ProductController");
const uploadImages = require("../middlewares/uploadImages");

router.post("/create-product", authMiddleware.authMiddleware, authMiddleware.isAdmin, ProductController.createProduct);
router.put("/upload/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, uploadImages.uploadPhoto.array('images', 10), uploadImages.productImgResize, ProductController.uploadImages);
router.put("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, ProductController.updateProduct);
router.get("/:id", ProductController.getProduct);
router.delete("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, ProductController.deleteProduct);


router.get("/", ProductController.getAllProducts);

module.exports = router;