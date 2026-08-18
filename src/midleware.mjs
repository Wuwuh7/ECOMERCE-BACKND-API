import { userDb } from "./service.mjs";
import basicAuth from "express-basic-auth";

 const authentication = basicAuth({
 authorizer: async (email,password,cb) => {
    try {
      
        const user = await userDb(email);
        console.log(`kieh db ne ${user}`)
        if(!user || !user.password) {
            return cb(null,false);
        }
        const matchPassword = (password === user.password);
        return cb(null,Boolean(matchPassword))
    } catch (error) {
    console.log(error)  
    return cb(null, false);      
    }
 },   
 authorizeAsync : true,
 unauthorizedResponse: {
    status:"gagal masseh",
    message: "email or password are not valid"
 }
});

export async function checkAuth(req,res,next) {
   authentication(req,res,next);
}