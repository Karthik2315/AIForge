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

export const createUserProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const {initial_prompt} = req.body;
    if(!userId){
      return res.status(401).json({success:false,message:"Unauthorized"})
    }
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if(!user || user.credits < 5){
      return res.status(403).json({success:false,message:"Not enough credits"})
    }
    const project = await prisma.websiteProject.create({
      data:{
        name: initial_prompt.length > 50 ? initial_prompt.substring(0,47) + "..." : initial_prompt,
        initial_prompt,
        userId
      }
    })
    await prisma.user.update({
      where:{id:userId},
      data:{totalCreation:{increment:1},credits:{decrement:5}}
    });
    await prisma.conversation.create({
      data:{
        role:"user",
        content:initial_prompt,
        projectId:project.id
      }
    });
    res.status(200).json({success:true,projectId:project.id})
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}