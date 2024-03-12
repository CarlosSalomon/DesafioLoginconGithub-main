import passport from "passport";
import github from "passport-github2";
import userManager from "../dao/mongomanagers/userManagerMongo.js"
import { userModel } from "../dao/models/user.model.js";

const usmanager = new userManager()

export const initPassportGit = () => {
    passport.use("github", new github.Strategy(
        {
            clientID: "Iv1.72a970297fa90bb8",
            clientSecret: "9299b100bc86a1ce2230dd73d7dd4f443ff07f89",
            callbackURL: "http://localhost:8080/sessions/callbackGithub"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let { name, email } = profile._json;
                if (email === null) {
                    const emailgit = profile.id + profile.username + "@users.noreply.github.com"
                    
                    let user = await usmanager.getUsers(emailgit);
                    user = await userModel.create({ username: emailgit, name: name, email:emailgit });
                    
                    return done(null, user)
                } else {
                    let user = await usmanager.getUsers(email);
                    if (!user) {
                        user = await userModel.create({ username: email, name: name, email:email });
                    }
                    return done(null, user)
                }



            } catch (error) {
                return done(error)
            }
        }
    ))
}//fin initPassportGit



passport.serializeUser((user, done) => {
    done(null, user)
}); //funcion que guardara el usuario en la sesión

passport.deserializeUser((user, done) => {
    done(null, user)
})

