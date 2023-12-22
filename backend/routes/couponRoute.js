const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const CouponController = require("../controllers/CouponController");

router.post("/create-coupon", authMiddleware.authMiddleware, authMiddleware.isAdmin, CouponController.createCoupon);
router.get("/", authMiddleware.authMiddleware, authMiddleware.isAdmin, CouponController.getAllCoupon);
router.put("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, CouponController.updateCoupon);
router.delete("/:id", authMiddleware.authMiddleware, authMiddleware.isAdmin, CouponController.deleteCoupon);



module.exports = router;
