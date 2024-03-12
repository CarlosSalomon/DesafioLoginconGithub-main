import passport from "passport";
import local from  'passport-local'
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidatePassword } from "./bcrypt.js";
import userManager from "../dao/mongomanagers/userManagerMongo.js";

const usmanager = new userManager();


const  LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {

            const { name, lastname, tel } = req.body;
            console.log(password)
            try {
                const userExist = await userModel.findOne({ email });
                if (userExist) {
                    return done(null, false, 'Username already exists');
                }
             
                let newUser = await userModel.create({ email,name, lastname, password:createHash(password), tel });
                console.log(newUser.password)
                return done(null, newUser);
            } catch (error) {
                return done('Error creating user: ' + error);
            }
        }
    ));



    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                console.log("User doesn't exist");
                return done(null, false);
            }
    
            // Validar la contraseña de forma asincrónica
            const isValidPassword = await isValidatePassword(user, password);
            if (!isValidPassword) {
                console.log("Invalid password");
                return done(null, false);
            }
    
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser((id, done) => {
        userModel.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(error => {
                done(error);
            });
    });
    
}

export default initializePassport;