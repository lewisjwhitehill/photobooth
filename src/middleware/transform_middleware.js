// photo transforming middleware 
import fs from 'fs'
import path from 'path'


function transformMiddleware(req, res, next){

  const fileName = req.headers['filename']
  const folderPath = path.join(process.cwd(), 'images', 'raw')
  const filePath = path.join(folderPath, fileName)

  // make sure file exists in disk
  if(!fs.existsSync(filePath)){
    return res.status(404).json({"error" : "File not found on server"})
  }

  const instructions = req.headers['instructions']
  if(!instructions){
    res.status(400).json({"error": "instructions not provided"})
  }

  req.fileName = fileName
  req.filePath = filePath
  req.instructions = instructions
  
  next();
}

export default transformMiddleware