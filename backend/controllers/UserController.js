const { generateToken } = require("../config/jwtoken");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
const Coupon = require("../models/CouponModel");
const Order = require("../models/OrderModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongoDBId");
const { generateRefreshToken } = require("../config/refreshToken");
const { JsonWebTokenError } = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");
const {sendMail} = require("./EmailController");

//function for registering user on site
module.exports.registerUser = expressAsyncHandler(async (req,res)=>{
    try{
        //check if the email is already in use or not
        let user=await User.findOne({email: req.body.email});
        if(!user){
            //create a new user
            user=new User(req.body);
            return res.json(user);
        }
        else{
            throw new Error("User already exist");
        }
    }
    catch(err){
        console.log("error in registering user",err);
        return
    }
});

module.exports.loginUser = expressAsyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const user = await User.find({email});
    if(user && await user.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(user?._id);
        const updateUser = await User.findByIdAndUpdate(user?._id,
             {refreshToken: refreshToken},
             {new:true});
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 24*60*60*1000*3,
        });
        res.json({
            _id: user?._id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            mobile: user?.mobile,
            token: generateToken(user?._id)
        });
    }else{
        throw new Error("Invalid credentials");
    }

});

module.exports.loginAdmin = expressAsyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const admin = await User.find({email});
    if(admin.role !== "admin"){
        throw new Error("Not authorized");
    }
    if(admin && await admin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(admin?._id);
        const updateUser = await User.findByIdAndUpdate(admin?._id,
             {refreshToken: refreshToken},
             {new:true});
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 24*60*60*1000*3,
        });
        res.json({
            _id: admin?._id,
            firstname: admin?.firstname,
            lastname: admin?.lastname,
            email: admin?.email,
            mobile: admin?.mobile,
            token: generateToken(admin?._id)
        });
    }else{
        throw new Error("Invalid credentials");
    }
});

//get all users
module.exports.getUsers = expressAsyncHandler(async (req,res)=> {
    try{
        const getAllUsers = await User.find({});
        res.json(getAllUsers);
    }
    catch(err){
        console.log("Error in getting all users");
        throw new Error("Error in getting all users");
    }
});

//get single user
module.exports.singleUser = expressAsyncHandler(async (req,res)=>{
    const userId = req.user._id;
    validateMongodbId(userId);  
    try{
        const user = await User.findById(userId);
        if(!user){
            console.log("no user found");
            throw new Error("No user found")
        }
        else{
            res.json(user);   
        }
    }catch(err){
        console.log("error in finding single user", err);
        throw new Error("error in finding single user");
    }
});

//delete a user
module.exports.deleteUser = expressAsyncHandler(async (req,res)=>{
    const userId = req.user._id;
    validateMongodbId(userId);
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            console.log("no user found");
            throw new Error("No user found")
        }
        else{
            res.json(user);   
        }
    }catch(err){
        console.log("error in finding single user", err);
        throw new Error("error in finding single user");
    }
});

//updating the user info
module.exports.updateUser = expressAsyncHandler(async (req,res)=>{
    const userId = req.user._id;
    validateMongodbId(userId);
    const updateField = req.body;
    try{
        const updatedUser = await User.findByIdAndUpdate(userId, {
            //update fields separately
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        } , {new:true});
        res.json(updatedUser);
    }catch(err){
        console.log("error in updating user ", err);
        throw new Error("error in updating user");
    }
});

module.exports.blockUser = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(userId);
    try{
        const block = await User.findByIdAndUpdate(id, {isBlocked:true}, {new:true});
        return res.json({
            message: "User blocked",
        });
    }catch(err){
        console.log("error in blocking user ", err);
        throw new Error(err);
    }
});
module.exports.unblockUser = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(userId);
    try{
        const block = await User.findByIdAndUpdate(id, {isBlocked:false}, {new:true});
        return res.json({
            message: "User Unblocked",
        });
    }catch(err){
        console.log("error in unblocking user ", err);
        throw new Error(err);
    }
});

//to handle refresh token
module.exports.handleRefreshToken = expressAsyncHandler(async (req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("no refresh token");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new Error("No refresh tokne in DB");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        if(err || user._id !== decoded._id){
            throw new Error("there is a error in refresh Token");
        }
        const accessToken = generateToken(user?._id);
        res.json(accessToken);
    })
});

module.exports.logoutUser = expressAsyncHandler(async (req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("no refresh token");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus (204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken : "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus (204);
});


//resetting the password

module.exports.updatePassword = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    const password = req.body.password;
    validateMongodbId(id);
    const user = await User.findById(id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }
    else{
        res.json(user);
    }
});

module.exports.forgotPasswordToken = expressAsyncHandler(async (req,res)=>{
    const email = req.body.email;
    const user = await User.findOne({email});
    if(!user){
        throw new Error("User not found with this email");
    }
    else{
        try{
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetUrl = `Hi, Please follow this link to reset your password. This link is valid for 10 mins from now. <a href ="http://localhost:8000/api/user/reset-password/${token}/ >Click here</a>`;
            const data = {
                to: email,
                subject: "Forgot Passsword Link",
                text: "Hey, user",
                htm: resetUrl,
            };
            sendMail(data);
            res.json(token);
        }catch(err){
            console.log("Error in generating token ", err);
            throw new Error("Error in generating reset password token");
        }
    }
});

module.exports.resetPassword = expressAsyncHandler(async (req,res)=>{
    const password = req.body.password;
    const token = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},
    });
    if(!user){
        throw new Error("Token expired, Please try again later");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);

}); 

module.exports.getWishlist = expressAsyncHandler(async (req,res)=>{
    try{
        const id = req.user._id;
        validateMongodbId(id);
        const findUser = User.findById(id).populate("wishlist");
        res.json(findUser);
    }catch(err){throw new Error(err);}
});

module.exports.addToWishlist = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);
    const prodId = req.body.prodId;
    try{
        const user = await User.findById(id);
        const alreadyAdded = user.wishlist.find((pid)=>pid.toString() === prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(id, {
                $pull: {wishlist: prodId}},
                {new: true}
            );
        }
        else{
            let user = await User.findByIdAndUpdate(id, {
                $push: {wishlist: prodId}},
                {new: true}
            );
        }
        res.json(user);
    }catch(err){throw new Error("Error while addng to wishlist");}
});



module.exports.saveAddress = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);

    try{
        const updatedUser = await User.finndByIdAndUpdate(id, {
            address: req?.body?.address,
        }, {new:true});
        res.json(updatedUser);
    }catch(err){throw new Error(err);}
});



module.exports.addToCart = expressAsyncHandler(async (req,res)=>{
    const cart = req.body.cart;
    const id = req.user._id;
    validateMongodbId(id);
    try{
        let products = [];
        const user = await User.findById(id);

        const alreadyExistCart = await Cart.findOne({orderBy: user._id});
        if(alreadyExistCart){
            alreadyExistCart.remove();
        }
        for(let i=0; i<cart.length; i++){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }

        let cartTotal = 0;
        for(let i=0; i<products.length; i++){
            cartTotal += products[i].price * products[i].count;
        }
        const newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?._id
        }).save();
        res.json(newCart);
    }catch(err){
        throw new Error(err);
    }
});


module.exports.getUserCart = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);
    try{
        const cart = await Cart.findOne({orderBy: id}).populate("products.product");
        
    }catch(err){throw new Error(err);}
});


module.exports.emptyCart = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);
    try{
        const user = await User.findOne({id});
        const cart = await Cart.findOneAndRemove({orderBy: id});
        
    }catch(err){throw new Error(err);}
});


module.exports.applyCoupon = expressAsyncHandler(async (req,res)=>{
    const coupon = req.body.coupon;
    const id = req.user._id;
    const validCoupon = await Coupon.findOne({name: coupon});
    if(validCoupon === null){
        throw new Error("Invalid Coupon");
    }
    else{
        const user = await User.findOne({id});
        let {products, cartTotal} = await Cart.findOne({orderBy: user?._id}).populate("products.product");
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
        await Cart.findOneAndUpdate({orderBy: user._id}, {totalAfterDiscount},{new:true});
        res.json(totalAfterDiscount);
    }
});


module.exports.createOrder = expressAsyncHandler(async (req,res)=>{
    const COD = req.body.COD;
    const id = req.user._id;
    const couponApplied = req.body.couponApplied;
    if(!COD){
        throw new Error("Create cash order failed");
    }
    try{
        const user = await User.findById();
        let userCart = await Cart.findOne({orderBy: user._id});
        let finalAmount = 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalTotal = userCart.totalAfterDiscount;
        }
        else{
            finalTotal = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delievery",
                currency: "USD",
            },
            orderBy: user._id,
            orderStatus: "Cash on Delievery",
        }).save();
        let update = userCart.products.map((item)=>{
            return {updateOne:{
                filter: {id: item.product.id},
                update: {$inc: {quantity: -item.count, sold: +item.count}},
            }}
        });
        const updated = await Product.bulkWrite(update,{});
        res.json({
            message: "success"
        });
    }catch(err){
        throw new Error(err);
    }
});


module.exports.listOrders = expressAsyncHandler(async (req,res)=>{
    try{
        const id = req.user._id;
        validateMongodbId(id);
        const userOrders = await Order.findOne({orderBy: id}).populate("products.product");
        res.json(userOrders);
    }catch(err){throw new Error(err);}
});


module.exports.updateOrderStatus = expressAsyncHandler(async (req,res)=>{
    const orderId = req.params.id;
    validateMongodbId(id);
    const status = req.body;
    try{
        const updatedOrderStatus = await Order.findByIdAndUpdate(orderId, {orderStatus: status, paymentIntent:{status: status},}, {new:true});
        res.json(updatedOrderStatus);
    }catch(err){throw new Error(err);}

});