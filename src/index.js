
import dotenv from "dotenv"

import  express from 'express'
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from 'cors'
import {app , server } from './lib/socket.js'

import path from 'path'
 
dotenv.config()
console.log(dotenv.config());




const PORT = process.env.PORT
const __dirname = path.resolve()


app.use(express.json({ limit: '10mb'}))
app.use(cookieParser())
app.use(cors({
    origin: "https://chat-app-frontend-mu-one.vercel.app",
    credentials:true
}))
app.options("*", cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://chat-app-frontend-mu-one.vercel.app");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use("/api/auth" , authRoutes)
app.use("/api/messages" , messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "../frontend/dist")))
    app.get("*" , (req , res)  => {
        res.sendFile(path.join(__dirname , "../frontend/dist/index.html"))
    })
}



server.listen(PORT,() => {
    console.log(`Server is running on PORT :` + PORT);
    connectDB()
})

