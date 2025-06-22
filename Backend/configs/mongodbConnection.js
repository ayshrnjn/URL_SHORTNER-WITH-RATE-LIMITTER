const mongoose= require("mongoose");


const connectDB=async()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URI); 
     console.log("MongoDB connected Sucessfully");
    }
    
    catch(err){
        console.error(`error connecting to MongoDB ${err}`);

}};
module.exports=connectDB; 