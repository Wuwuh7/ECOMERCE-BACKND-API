import { userDb,findCartId } from "./service.mjs";
import basicAuth from "express-basic-auth";
import { verifyJWT } from "./auth.mjs";

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


export const ownershipChecker = async (req,res,next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
            return res.status(401).json({ message: "Token gak ada, lur!" });
        }
   const validation = await verifyJWT(token);

   if(!validation?.payload?.userId) {
      return res.status(401).json({message:"payload rusak"});
   }
   req.user = validation.payload;
   
   const cartId = req.params.cartId;

   if(cartId) {

      if (!cart) {
                return res.status(404).json({ message: "Cart gak ditemukan!" });
            }

      if (cart.userId !== req.user.userId) {
                return res.status(403).json({ message: "Bukan keranjang punya lu, dilarang ngacak-ngacak!" });
            }
   findCartId(cartId)
   }
   next();
   } catch(error) {
      console.log(error);
   }
}
