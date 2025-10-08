// services/transformService.js
import { json } from "express";
import { transformImage } from "../ai/nanoBanana.js";

export async function convertPhoto(filePath, instructions) {
  try{
        const prompt = `Using the provided image of this person, please: ` + instructions
        const result = await transformImage(prompt, filePath)
        return { "transformed_filename" : result };
  } catch(err){
        console.log(err)
        return json({error: err})
  }
  
}
