const mongoose = require('mongoose');

// Declare the Schema of the Mongo model

var ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
    },
    quantity:{
        type: Number,
        required: true
    },
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
    sold:{
        type: Number,
        default: 0,
        select: false,
    },
    images:{
        type: Array,
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Red"],
    },
    ratings: [{
        star: Number,
        comment: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },
    }],
    totalRatings:{
        type: String,
        default: 0,
    },
},{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', ProductSchema);