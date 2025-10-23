import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

//this is the root of our application
app.get("/", (req, res) =>{
    res.send("Hello Node World");
})

const PORT = process.env.PORT || 4000;
//list the app on the browser

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
