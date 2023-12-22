const mongoose = require('mongoose'); 
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var UserSchema = new mongoose.Schema({
    firstname:{
        type:String,
        default:"",
        require: true,
    },
    lastname:{
        type:String,
        default:"",
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user",
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    refreshToken:{
        type: String,
    },
    cart:{
        type: Array,
        default: [],
    },
    address: {type: String},
    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordresetExpires: Date,
},{
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    const user = this;
    // Only hash the password if it's modified
    if (!user.isModified('password')){
        return next();
    }
    try {
        // Generating a salt
        const salt = await bcrypt.genSalt(10);

        // Hashing the password with the generated salt
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Overriding the plaintext password with the hashed one
        user.password = hashedPassword;

        next();
    }catch (error) {
        return next(error);
    }
});

UserSchema.methods.isPasswordMatched = async (enterPassword)=>{
    return await bcrypt.compare(enterPassword, this.passsword)
}

//create a reset password token
UserSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30*60*1000;
    return resetToken;

}
//Export the model
module.exports = mongoose.model('User', UserSchema);