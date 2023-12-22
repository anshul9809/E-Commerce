const mongoose = require("mongoose");

const ProductCategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
}
,{
    timestamps: true
});


module.exports = mongoose.model("ProductCategory", ProductCategorySchema);