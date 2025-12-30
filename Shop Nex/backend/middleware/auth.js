// import jwt from 'jsonwebtoken'
// import cartRoute from '../routes/cartRoute.js';


// const authUser = async(req,res,next)=>{
   
//     const {token} = req.headers;

//     if(!token){
//         return res.json({success:false, message:'Not Authorized Login Again'})
//     }
//     try {

//         const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.body.userId = token_decode.id
//         next()
        
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
        
//     }
// }

// export default authUser;

import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // attach logged-in user
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }
};

export default protect;
