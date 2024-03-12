
import bcryps from  'bcrypt';


//registro
export const createHash = (passw) => {
    return bcryps.hashSync(passw, bcryps.genSaltSync(10))
}

//login
export const isValidatePassword = (user, password) => {
    return bcryps.compare(password, user.password);
}