const mongoose = require("mongoose");
module.exports.validateMongodbId = (id)=>{
    const isValid = mongoose.Schema.ObjectId.isValid(id);
    if(!isValid){
        throw new Error("this mongoose id is not valid");
    }
}