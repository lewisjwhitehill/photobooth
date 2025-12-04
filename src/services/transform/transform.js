// services/transformService.js
import { transformImage } from "../ai/nanoBanana.js";

export async function convertPhoto(imageData, instructions) {
  const prompt =
    `Using the provided image of this person, please: ` + instructions;
  try {
    const result = await transformImage(prompt, imageData);
    return result;
  } catch (err) {
    console.error("Error in convertPhoto: ", err);
    throw err;
  }
}
