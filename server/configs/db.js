import mongoose from "mongoose";

 const connectdDB=async()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("Connected to MongoDB");
        })
        await mongoose.connect(`${process.env.MONGO_URI}/SmartScribe `, )
    }catch(err){
        console.error("Error connecting to the database:", err.message);
    }
}
export default connectdDB;