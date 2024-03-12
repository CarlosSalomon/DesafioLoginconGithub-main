import mongoose from "mongoose";

const URI="mongodb+srv://csalomon55:Lujos101@cluster0.m0n3rqd.mongodb.net/?retryWrites=true&w=majority"
 

const connectToDB = () => {
    try {
        mongoose.connect(URI)
        console.log('connected to DB ecommerce')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB