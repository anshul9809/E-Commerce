const mongoose = require("mongoose");


const CouponSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        uppercase: true,
    },
    expiry:{
        type: Date,
        required: true,
    },
    discount:{
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Coupon", CouponSchema);