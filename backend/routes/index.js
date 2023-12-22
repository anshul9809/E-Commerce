
const express = require('express');
const router = express.Router();

router.use("/api/users", require("./authRoute"));
router.use("/api/product", require("./productRoute"));
router.use("/api/blog", require("./blogRoute"));
router.use("/api/product-category", require("./productCategoryRoute"));
router.use("/api/blog-category", require("./blogCategoryRoute"));
router.use("/api/brand", require("./brandRoute"));
router.use("/api/coupon", require("./couponRoute"));

module.exports = router;