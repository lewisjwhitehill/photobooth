const express = require("express");
const multer = require("multer");

const app = express();
// set the destination for photo uploads
const upload = multer({ dest: 'uploads/'})

const port = 8000;
app.listen(port, () => {
    console.log(`Server is now listenign on ${port}`);
});

// get endpoint
app.get('/', (req, res) => {
    res.send("Welcome to the photo uploader. Wow!");

});

// post endpoint, lets someone upload 20 photos max
app.post('/upload', upload.array('photos', 20), (req, res, next) => {
    try{
        res.sendStatus(200);
    }catch(err){
        console.error(err)
        res.sendStatus(500);
    }
   
});