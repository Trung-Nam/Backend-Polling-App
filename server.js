require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET","POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-type", "Authorization"],

    })
)

app.use(express.json());


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));