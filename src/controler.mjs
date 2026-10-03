import "dotenv/config"
import z from "zod"
import { detailingProduct,searchingProducts,addCart,deletingProduct,addStockCart,filteringData, logoutSession } from "./service.mjs"
import { createToken,verifyJWT } from "./auth.mjs";

let dataHelper = (query) => {
        const {name,category,price,size} = query;
        return {name,category,price,size};
}

let validationZod = z.object({
    productId: z.number(),
    quantity: z.number().min(1)
});

export const controlerFilter = async (req,res) => {
    const { category,price,size } = req.query;
    const resultFilter = await filteringData(category,price,size);
    return res.json({
        status : "dadi boss",
        result : resultFilter
    });
}

export const controlerDetailProducts = async (req,res) => {
  try {
    const { id } = req.params;
    const resultDetail = await detailingProduct(id);
    return res.json({
        status: "detaile kieh",
        result: resultDetail
    })
  } catch (error) {
console.log(error);
    return res.status(500).json({ status: "error", message: error.message });  }
}

export const controlerAddCart = async (req,res) => {
    const { userId } = req.user;
    const items = validationZod.parse(req.body);
    const resultAddCart = await addCart(items,userId);
    return res.json({
        status: "tambah kieh cart mu",
        result: resultAddCart
    })
}

export const controlerDeleteCart = async (req,res) => {
  try {
    const { id } = req.params;
    const resultDelete = await deletingProduct(id);
    return res.json({
        status: "tek apus ya",
        result: resultDelete
    })
  } catch (error) {
    console.log(error)
  }
}

export const controlerAddStock = async (req,res) => {
    const { id,quantity } = req.body;
    const resultAddStock = await addStockCart(id,quantity);
    res.json({
        status:"nambah stock guyss",
        result: resultAddStock
    })
}

export const controlerSearch = async (req,res) => {
    try {
    let dataSearched = dataHelper(req.query)
    const resultSearch = await searchingProducts(dataSearched)
    res.json({
        status:"kieh sing ko golet",
        result:resultSearch
    })
    } catch (error) {
     console.log(error)   
    }
}

export const controlerAuth = async (req,res) => {
    try {
        let serialObj = req.body;
        const resultAuth = await createToken(serialObj)
        res.cookie('jwt_token',resultAuth, {
            httpOnly:true,
            secure: process.env.Node_ENV === "production",
            sameSite: "strict",
            maxAge:3600000
        })
       return res.status(200).json({
            status:"verifikasi dadi",
            result:resultAuth
        })
    } catch (error) {
        console.log(error)
    }
}


export const controlerVerifyToken = async (req,res) => {
    let headerSign = req.headers.authorization;
    const token = headerSign && headerSign.split(' ')[1]; 
    const resultVerifyToken = await verifyJWT(token);
    res.json({
        status: "suksess lur",
        result:resultVerifyToken
    }) 
}

export const controlerLogout = async (req,res) => {
   try {
    let cookiesValue = req.cookies.jwt_token;
    const resultLogout = await logoutSession(cookiesValue);
    res.json({
        status: "josjis lur",
        result: resultLogout
    })
   } catch (error) {
     return res.status(500).json({ status: "error", message: error.message }); 
   }
}