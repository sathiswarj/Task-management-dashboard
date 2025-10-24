const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config();
const PORT = process.env.PORT  
const cors = require("cors")
const mongoose = require("mongoose");
const taskController = require("./controller/taskController");

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log(" Database connected successfully")
})
.catch((err)=>{
    console.log(" Database connection failed:", err.message)
})

 app.use("/api", taskController)

 

app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`)
})