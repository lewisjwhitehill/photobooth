const express = require("express");
const app = express();

const port = 8000;

app.listen(port, () => {
    console.log(`Server is now listenign on ${port}`);
});

// get endpoint
app.get('/', (req, res) => {
    res.send("Hello World!");

});