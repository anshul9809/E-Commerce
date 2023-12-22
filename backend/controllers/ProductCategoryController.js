const ProductCategory = require("../models/ProductCategoryModel");
const validateMongodbId = require("../utils/validateMongoDBId");
const expressAsyncHandler = require("express-async-handler");


module.exports.createCategory = expressAsyncHandler(async (req,res)=>{
    try{
        const newCategory = await ProductCategory.create(req.body);
        res.json(newCategory);
    }catch(err){
        console.log("Error while creating the category ", err);
        throw new Error("Error while creating the category");
    }
});


module.exports.updateCategory = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const updatedCategory = await ProductCategory.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedCategory);
    }catch(err){
        console.log("Error while creating the category ", err);
        throw new Error("Error while creating the category");
    }
});


module.exports.deleteCategory = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deletedCategory = await ProductCategory.findByIdAndDelete(id);
        res.json(deletedCategory);
    }catch(err){
        console.log("Error while creating the category ", err);
        throw new Error("Error while creating the category");
    }
});



module.exports.getACategory = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const category = await ProductCategory.findById(id);
        res.json(category);
    }catch(err){
        console.log("Error while creating the category ", err);
        throw new Error("Error while creating the category");
    }
});



module.exports.getAllCategory = expressAsyncHandler(async (req,res)=>{
    try{
        const category = await ProductCategory.findById(id);
        res.json(category);
    }catch(err){
        console.log("Error while creating the category ", err);
        throw new Error("Error while creating the category");
    }
});
