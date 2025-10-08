import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import { transcode } from "node:buffer";


export async function transformImage(instructions, image_path) {
  // make sure valid fields were provided
  if(!instructions || !image_path){ throw new Error("transform error: invalid information")}

  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

  // convert the image path into base 64
  const imageData = fs.readFileSync(image_path);
  const base64Image = imageData.toString("base64");
  // default to png
  const mimeType = mime.lookup(image_path) || "image/png";

  const instruction_text = instructions

  const prompt = [
        { text: instruction_text },
        {
          inlineData: {
                  mimeType: mimeType,
                  data: base64Image,
          },
        },
  ];
  console.log("calling nano banana stuff...")
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });

  // Get path to the folder we want to save in
  const __dirname = process.cwd();  // project root
  const transformedDir = path.join(__dirname, "images", "transformed");

  if (!fs.existsSync(transformedDir)) {
    throw new Error(`transform error: this file path doesn't exist: ${transformedDir}`)
  }
  // Get the finalized path and file name we're saving to
  const outputFilename = `transformed-${uuidv4()}.png`;
  const outputPath = path.join(transformedDir, outputFilename);
  // extract the image data from the response and write it to the outpath we created
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(outputPath, buffer);
      return outputFilename
    }
  }
}
