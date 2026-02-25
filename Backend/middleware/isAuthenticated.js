import { User } from "../models/userModels.js";
import jwt from "jsonwebtoken";



export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        message: "Auth Token is Invalid",
      });
    }

    const token = authHeader.split(" ")[1]; //[Bearer , scjhdsfhj(token)]
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registed token is expired",
        });
      }

      return res.status(400).json({
        success: false,
        message: "token Verification failed",
      });
    }

    const user = await User.findById(decoded.id)

    if(!user){
         return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user

    req.id= user._id
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const isAdmin =(req,res,next)=>{
  if(req.user&&req.user.role==='admin'){
    next();
  }else{
    return res.status(403).json({
      message:"Acess Denied "
    })
  }
}
