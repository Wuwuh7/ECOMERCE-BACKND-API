import { userDb,findCartId,AppErors } from "./service.mjs";
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

export const validationToken = async (req,res,next) => {
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
            return res.status(401).json({ message: "Token gak ada, lur!" });
        }
   const validation = await verifyJWT(token);

   if(!validation?.payload?.userId) {
      return res.status(401).json({message:"payload rusak"});
   }
   req.user = validation.payload;
   next();
}


export const ownershipChecker = async (req,res,next) => {
   try {
   const cartId = req.params.cartId;

   if(cartId) {
      const cart = await    findCartId(cartId);

      if (!cart) {
                return res.status(404).json({ message: "Cart gak ditemukan!" });
            }

      if (cart.userId !== req.user.userId) {
                return res.status(403).json({ message: "Bukan keranjang punya lu, dilarang ngacak-ngacak!" });
            }
   }
   next();
   } catch(error) {
      console.log(error);
   }
}

export const globalErorHandling = async (err,req,res,next) => {
   const statusCode = err.status || 500;
  const errorType = err.type || "INTERNAL_SERVER_ERROR";

  if (err.code === 'P2002') {
    throw new AppErors("Data sudah ada gess, ganti yang beda",409,"Conflict")
  }
    if (err.code === 'P2025') {
   throw new AppErors("Datanya gak ketemu gess",404,"Not Found")
  }
    if (err.code === 'P2003') {
   throw new AppErors("Data yang kamu minta/kirim aneh",400,"Bad Request")
  }
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: errorType,
    message: err.message || "Terjadi kesalahan pada server",
    details: err.details || null,
  });
};
