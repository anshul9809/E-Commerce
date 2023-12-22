const User = require("../models/UserModel");
const Blog = require("../models/BlogModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongoDBId");
const cloudinaryUploading = require("../utils/cloudinary");
const fs = require("fs");

module.exports.createBlog = expressAsyncHandler(async (req,res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        });
    }catch(err){
        console.log("Error while creating the blog ", err);
        throw new Error("Error while creating the blog");
    }
});

//updating the blog
module.exports.updateBlog = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id); 
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedBlog);
    }
    catch(err){
        throw new Error("Error while updating the blog");
    }

});

//get a blog
module.exports.getBlog = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id); 
    try{
        const blog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(id,
            {
                $inc: {numViews: 1},
            },
            {new : true});
        res.json(blog);
    }
    catch(err){
        throw new Error("Error while updating the blog");
    }

});

//get all the blogs
module.exports.getAllBlogs = expressAsyncHandler(async (req,res)=>{
    try{
        const blogs = await Blog.find();
        res.json(blogs);
    }
    catch(err){
        console.log("Error while fetching all blogs");
        throw new Error("Error while fetching all blogs");
    }
});

module.exports.deleteBlog = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    }
    catch(err){
        console.log("Error while deleting blog", err);
        throw new Error("Error while deleting blog");
    }
});

module.exports.likeBlog = expressAsyncHandler(async (req,res)=>{
    const blogId = req.body;
    validateMongodbId(id);
    try{
        const blogId = req.body.blogId;
        const blog = await Blog.findById(blogId);
        const loginUserId = req?.user?._id;
        const isLiked = blog?.isLiked;
        const disliked = blog?.dislikes?.find((userId)=>{
            userId.toString() === loginUserId.toString()
        });
        if(disliked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {dislikes: loginUserId},
                    isDisliked: false
                },
                {new: true}
            );
            res.json(blog);
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {likes: loginUserId},
                    isLiked: false
                },
                {new: true}
            );
            res.json(blog);
        }
        else{
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $push: {likes: loginUserId},
                    isLiked: false
                },
                {new: true}
            );
            res.json(blog);
        }
    }catch(err){
        console.log("Error while liking the blog ", err);
        throw new Error("Error while liking the blog");
    }
});

module.exports.dislikeBlog = expressAsyncHandler(async (req,res)=>{
    const blogId = req.body;
    validateMongodbId(id);
    try{
        const blogId = req.body.blogId;
        const blog = await Blog.findById(blogId);
        const loginUserId = req?.user?._id;
        const isdisliked = blog?.isDisliked;
        const liked = blog?.likes?.find((userId)=>{
            userId.toString() === loginUserId.toString()
        });
        if(liked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {likes: loginUserId},
                    isLiked: false
                },
                {new: true}
            );
            res.json(blog);
        }
        if(isdisliked){
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $pull: {dislikes: loginUserId},
                    isDisliked: false
                },
                {new: true}
            );
            res.json(blog);
        }
        else{
            const blog = await Blog.findByIdAndUpdate(blogId, 
                {
                    $push: {dislikes: loginUserId},
                    isDisliked: false
                },
                {new: true}
            );
            res.json(blog);
        }
    }catch(err){
        console.log("Error while liking the blog ", err);
        throw new Error("Error while liking the blog");
    }
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
        const findBlog = await Blog.findByIdAndUpdate(id, {
            imags: urls.map((file)=>{
                return file;
            })
        },
        {new:true});
        res.json(findBlog);
    }catch(err){
        throw new Error(err);
    }
});