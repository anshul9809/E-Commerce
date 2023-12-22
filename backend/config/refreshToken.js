const jwt = require("jsonwebtoken");

module.exports.generateRefreshToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "3d"});
}