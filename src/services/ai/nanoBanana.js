import { GoogleGenAI } from "@google/genai";

export async function transformImage(instructions, imageData) {
  // make sure valid fields were provided
  if (!instructions || !imageData) {
    throw new Error("transform error: invalid information");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // convert the image path into base 64
  const base64Image = imageData.toString("base64");
  // default to png
  const mimeType = "image/png";

  const instruction_text = instructions;

  const prompt = [
    { text: instruction_text },
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  console.log("finished calling nano banana stuff...");
  // extract the image data from the response and write it to the outpath we created
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      return {
        buffer,
        mimeType: part.inlineData.mimeType || "image/png"
      }
    }
  }
}
