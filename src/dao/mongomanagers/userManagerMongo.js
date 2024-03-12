import { userModel } from "../models/user.model.js";

export default class userManager {

    regUser = async (username,name, lastname,tel, email, password) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const newUser = await userModel.create({ username,name, lastname,tel, email, password });
        return newUser;
    }
    
    getUsers = async (email) => {
        const user = await userModel.findOne({ email });
        return user;
    }

    logInUser = async (email, password)=> {
        const user = await userModel.findOne({ email, password })
        if(!user){
            throw new Error("Invalid credentials");
        }
        return user;
    }
}