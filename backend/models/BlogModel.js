const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCategory",
    },
    numViews:{
        type: Number,
        require: true,
        default: 0,
    },
    isLiked:{
        type: Boolean,
        default: false,
    },
    isDisliked:{
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    images: [],
    author: {
        type: String,
        default: "Admin"
    }
},
{
    toJSON:{
        virtuals: true,
    },
    toObjects:{
        virtuals: true,
    },
    timestamps: true
});
module.exports = mongoose.model("Blog", BlogSchema);