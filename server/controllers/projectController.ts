import { Request,Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../config/openAI.js";

// controller function to make Revision 
export const getUserCredits = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if(!userId || !user){
      return res.status(401).json({success:false,message:"Unauthorized"})
    }
    const {projectId} = req.params;
    const {message} = req.body;
    if(user.credits < 5){
      return res.status(403).json({success:false,message:"Not enough credits"})
    }
    if(!message || message.trim() === ""){
      return res.status(400).json({success:false,message:"Please enter a valid prompt"})
    }
    const currentProject = await prisma.websiteProject.findUnique({
      where:{id:projectId,userId},
      include:{versions:true}
    });
    await prisma.user.update({
      where:{id:userId},
      data:{
        credits:{decrement:5},
      }
    });
    await prisma.conversation.create({
      data:{
        role:"user",
        content:message,
        projectId:projectId || '',
      }
    });
    const promptEnhanceResponse = await openai.chat.completions.create({
      model:'z-ai/glm-4.5-air:free',
      messages:[
        {
          role:"system",
          content:`
          You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.
          Enhance this by:
          1. Being specific about what elements to change
          2. Mentioning design details (colors, spacing, sizes)
          3. Clarifying the desired outcome
          4. Using clear technical terms
          Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
        },
        {
          role:"user",
          content:`user request: "${message}"`
        }
      ]
    });
    const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;
    await prisma.conversation.create({
      data:{
        role:"assistant",
        content:`I've enhanced your prompt to be more specific and actionable for a web developer: "${enhancedPrompt}"`,
        projectId:projectId || '',
      }
    });
    await prisma.conversation.create({
      data:{
        role:"assistant",
        content:"Now making changes to your website",
        projectId:projectId || '',
      }
    });
    const codeGenerationResponse = await openai.chat.completions.create({
      model:'z-ai/glm-4.5-air:free',
      messages:[
        {
          role:"system",
          content:`
          You are an expert web developer. 
          CRITICAL REQUIREMENTS:
          - Return ONLY the complete updated HTML code with the requested changes.
          - Use Tailwind CSS for ALL styling (NO custom CSS).
          - Use Tailwind utility classes for all styling changes.
          - Include all JavaScript in <script> tags before closing </body>
          - Make sure it's a complete, standalone HTML document with Tailwind CSS
          - Return the HTML Code Only, nothing else
          Apply the requested changes while maintaining the Tailwind CSS styling approach.
          `
        },{
          role:"user",
          content:`
          Here is the current website code: "${currentProject?.current_code}" 
          The user wants these changes : "${enhancedPrompt}"`
        }
      ]
    });
    const code = codeGenerationResponse.choices[0].message.content;
    const version = await prisma.version.create({
      data:{
        code:code?.replace(/```[a-z]*\n?/gi,'').replace(/```$/g,'').trim(),
        description:"Changes made",
        projectId
      }
    });
    await prisma.conversation.create({
      data:{
        role:"assistant",
        content:"I've made the requested changes to your website.Please preview it",
        projectId:projectId || '',
      }
    });
    await prisma.websiteProject.update({
      where:{id:projectId || ''},
      data:{
        current_code:code?.replace(/```[a-z]*\n?/gi,'').replace(/```$/g,'').trim(),
        current_version_index:version.id
      }
    });
    res.status(200).json({success:true,message:"Changes made successfully"})
  } catch (error:unknown) {
    await prisma.user.update({
      where:{id:userId},
      data:{
        credits:{increment:5}
      }
    });
    console.error(error);
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
};

// function to rollback to a specific version 
export const rollbacktoVersion = async(req:Request,res:Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      return res.status(401).json({success:false,message:"Unauthorized"})
    }
    const {projectId,versionId} = req.params;
    const project = await prisma.websiteProject.findUnique({
      where:{id:projectId},
      include:{versions:true}
    });
    if(!project){
      return res.status(404).json({success:false,message:"Project not found"})
    }
    const version =project.versions.find((version) => version.id === versionId);
    if(!version){
      return res.status(404).json({success:false,message:"Version not found"})
    }
    await prisma.websiteProject.update({
      where:{id:projectId},
      data:{
        current_code:version.code,
        current_version_index:version.id
      }
    })
    await prisma.conversation.create({
      data:{
        role:"assistant",
        content:`I've have rolled back your website to selected version. Please preview it to see the changes.`,
        projectId:projectId || '',
      }
    }) 
    res.status(200).json({success:true,message:"Rolled back successfully"})
  } catch (error:unknown) {
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}