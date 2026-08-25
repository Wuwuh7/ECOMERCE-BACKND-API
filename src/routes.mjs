import express from "express";
import { checkAuth,ownershipChecker,verifyAfterLogin } from "./midleware.mjs";
import { controlerAddCart,controlerDetailProducts,controlerSearch,controlerAddStock,controlerFilter,controlerDeleteCart,controlerAuth,controlerVerifyToken } from "./controler.mjs";
import { verify } from "jsonwebtoken";

const route = express.Router();

route.post("/auth",checkAuth, controlerAuth)

route.get("/token",controlerVerifyToken)

route.get("/product/:id",controlerDetailProducts);

route.get("/filter",controlerFilter);

route.post("/cart", verifyAfterLogin , controlerAddCart)

route.delete("/cart", verifyAfterLogin , ownershipChecker ,controlerDeleteCart)

route.post("/quantity", verifyAfterLogin , ownershipChecker ,controlerAddStock);

route.get("/search",controlerSearch);

export default route;