const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongoDBId");
const slugify = require("slugify");
const cloudinaryUploading = require("../utils/cloudinary");
const fs = require("fs");

module.exports.createProduct = expressAsyncHandler(async (req,res)=>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(err){
        throw new Error(err)
    }
});

module.exports.getProduct = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(userId); 
    try{
        const findProduct = await Product.findById({id});
        res.json(findProduct);
    }catch(err){
        throw new Error(err);
    }
});

module.exports.getAllProducts = expressAsyncHandler(async (req,res)=>{
    try{

        //filtering of product
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el)=>{
            delete queryObj[el]
        });
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>{`$${match}`});
        let query = await Product.find(JSON.parse(queryStr))
        const product = query;

        //sorting of product
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy)
        }
        else{
            query = query.sort("-createdAt");
        }

        //limiting the fields

        if(req.query.fields){
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        }
        else{
            query = query.select("-__v");
        }

        //pagination

        const page = req.query.page;
        const limit = req.quer.limit;
        const skip = (page-1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error("This page does not exist");
        }

        res.json(product);
    }catch(err){
        throw new Error(err);
    }
});


module.exports.updateProduct = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id); 
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
            const updateProduct = await Product.findOneAndUpdate(id, req.body, {new: true});
        }
    }catch(err){
        throw new Error(err);
    }
});


module.exports.deleteProduct = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id); 

    try{
        const deletedProduct = await Product.findOneAndDelete(id);
        res.json(deletedProduct);

    }catch(err){
        throw new Error(err);
    }
});


module.exports.rating = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    const star = req.body.star;
    const prodId = req.body.prodId;
    const comment = req.body.comment;
    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId)=>{
            userId.postedBy.toString() === id.toString();
        });
        if(alreadyRated){
            const updateRating = await Product.updateOne({
                ratings: {$elemMatch: alreadyRated}
            },{
                $set: {"ratings.$.star": star, "ratings.$.comment": comment}
            },{new: true}); 
            res.json(updateRating);
        }
        else{
            const rateProduct = await Product.findByIdAndUpdate(prodId, 
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: id,
                        }
                    }
                },
                {new: true});
            res.json(rateProduct);
        }
        const getAllRatings = Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        let sumRating = getAllRatings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr, 0);
        let actualRating = Math.round(sumRating/totalRating);
        let finalProduct = await Product.findByIdAndUpdate(prodId, actualRating, {new:true});
        res.json(finalProduct);

    }catch(err){throw new Error("Unable to find the product");}
});



module.exports.uploadImages = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const uploader = (path)=> cloudinaryUploading(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of file){
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            imags: urls.map((file)=>{
                return file;
            })
        },
        {new:true});
        res.json(findProduct);
    }catch(err){
        throw new Error(err);
    }
});