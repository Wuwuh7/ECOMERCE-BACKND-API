import express from "express";
import { checkAuth,validationToken,ownershipChecker } from "./midleware.mjs";
import { controlerAddCart,controlerDetailProducts,controlerSearch,controlerAddStock,controlerFilter,controlerDeleteCart,controlerAuth,controlerVerifyToken } from "./controler.mjs";

const route = express.Router();

route.post("/auth",checkAuth, controlerAuth)

route.get("/token",controlerVerifyToken)

route.get("/product/:id",controlerDetailProducts);

route.get("/filter",controlerFilter);

route.post("/cart", validationToken,controlerAddCart)

route.delete("/cart",validationToken,ownershipChecker, controlerDeleteCart)

route.post("/quantity",validationToken,ownershipChecker,controlerAddStock);

route.get("/search",controlerSearch);

export default route;