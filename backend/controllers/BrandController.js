const Brand = require("../models/BrandModel");
const validateMongodbId = require("../utils/validateMongoDBId");
const expressAsyncHandler = require("express-async-handler");


module.exports.createBrand = expressAsyncHandler(async (req,res)=>{
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    }catch(err){
        console.log("Error while creating the Brand ", err);
        throw new Error("Error while creating the Brand");
    }
});


module.exports.updateBrand = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedBrand);
    }catch(err){
        console.log("Error while creating the Brand ", err);
        throw new Error("Error while creating the Brand");
    }
});


module.exports.deleteBrand = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    }catch(err){
        console.log("Error while creating the Brand ", err);
        throw new Error("Error while creating the Brand");
    }
});



module.exports.getABrand = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const Brand = await Brand.findById(id);
        res.json(Brand);
    }catch(err){
        console.log("Error while creating the Brand ", err);
        throw new Error("Error while creating the Brand");
    }
});



module.exports.getAllBrand = expressAsyncHandler(async (req,res)=>{
    try{
        const Brand = await Brand.findById(id);
        res.json(Brand);
    }catch(err){
        console.log("Error while creating the Brand ", err);
        throw new Error("Error while creating the Brand");
    }
});
