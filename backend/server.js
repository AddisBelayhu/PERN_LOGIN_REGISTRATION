import express from 'express';
const app = express();

//this is the root of our application
app.get("/", (req, res) =>{
    res.send("Hello Node World");
})

//list the app on the browser

app.listen(4000, () => {
    console.log("Server is running on port 4000");
})
