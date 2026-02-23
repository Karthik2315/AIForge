import { Request,Response,NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const protect = async (req:Request,res:Response,next:NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers:fromNodeHeaders(req.headers)
    })
    if(!session || !session.user){
      return res.status(401).json({success:false,message:"Unauthorized"})
    }
    req.userId = session.user.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}