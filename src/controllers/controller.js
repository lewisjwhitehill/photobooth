// controller for /photo endpoints
import { convertPhoto } from '../services/transform/transform.js';

export async function savePhoto (req, res, next) {
  if(req.files[0]){
    return res.status(201).json({ "successful uploaded file" : req.files[0]});
  }
  return res.status(400).json({ "file upload error" : "no file provided"})
}

export async function transformPhoto (req, res, next) {
  try {
    // get the file names
    const filePath = req.filePath ?? [];
    const instructions = req.instructions ?? "";

    if (!filePath || !instructions) return res.status(400).json({ error: 'Instructions or path invalid' });
    // convert the file 
    const result = await convertPhoto(filePath, instructions);
    return res.json({ "successful transformation" : result });
  } catch (err) { 
      next(err); 
  }
}

// export async function returnPhoto (req, res, next) {
//   try{
    
//   } catch(err){
//     next(err)
//   }
// }