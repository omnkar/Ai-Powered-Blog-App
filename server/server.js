import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectdDB from './configs/db.js';
import adminRouter from './routes/admin.routes.js';
import blogRouter from './routes/blogs.routes.js';
import userRouter from './routes/user.routes.js';

const app=express();
const PORT= process.env.PORT || 3000;


await connectdDB();
//middlewares

app.use(cors());
app.use(express.json());



app.get("/",(req,res)=>{
    res.send("Welcome to the server!");
})

app.use("/api/admin",adminRouter);
app.use("/api/blog",blogRouter);
app.use("/api/user",userRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

export default app;