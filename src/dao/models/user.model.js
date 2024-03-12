import mongoose from 'mongoose';

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        
    },
    password: {
        type: String,
        
    },
    email: {
        type: String,
        unique: true
     },
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    tel: {
        type: String,
    },
    admin: {
        type: Boolean },
    rol: {  
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    },
},
{
    timestamps: true,
    strict:false
}

);

export const userModel = mongoose.model('User', userSchema, userCollection);
