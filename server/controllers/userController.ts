import { Request,Response } from "express";
import prisma from "../lib/prisma.js";

export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      return res.status(401).json({success:false,message:"Unauthorized"})
    }
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    res.status(200).json({success:true,credits:user?.credits || 0})
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}

