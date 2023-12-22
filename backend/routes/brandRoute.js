const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const BrandController = require("../controllers/BrandController");


router.post("/create-brand",authMiddleware.authMiddleware, authMiddleware.isAdmin, BrandController.createBrand);
router.put("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, BrandController.updateBrand);
router.delete("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, BrandController.deleteBrand);
router.get("/:id", BrandController.getABrand);
router.get("/", BrandController.getAllBrand);

module.exports = router;