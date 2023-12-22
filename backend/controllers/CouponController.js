const Coupon = require("../models/CouponModel");
const Product = require("../models/ProductModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongoDBId");

module.exports.createCoupon = expressAsyncHandler(async (req,res)=>{
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }catch(err){
        console.log("error while creating the coupon ", err);
        throw new Error("Error while creatng the coupon");
    }
});

module.exports.getAllCoupon = expressAsyncHandler(async (req,res)=>{
    try{
        const coupons = await Coupon.find();
        res.json(coupons);
    }catch(err){
        console.log("errow while getting all coupons");
        throw new Error(err);
    }
});


module.exports.updateCoupon = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body,{new:true});
        res.json(updatedCoupon);
    }catch(err){
        throw new Error(err);
    }
});

module.exports.deleteCoupon = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    }catch(err){
        throw new Error(err);
    }
});

module.exports.updateCoupon = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body,{new:true});
        res.json(updatedCoupon);
    }catch(err){
        throw new Error(err);
    }
});