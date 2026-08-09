import express from "express";
import { controlerAddCart,controlerDetailProducts,controlerSearch,controlerAddStock,controlerFilter,controlerDeleteCart } from "./controler.mjs";

const route = express.Router();

route.get("/product/:id",controlerDetailProducts);

route.get("/filter",controlerFilter);

route.post("/cart", controlerAddCart)

route.delete("/cart", controlerDeleteCart)

route.post("/quantity",controlerAddStock);

route.get("/search",controlerSearch);

export default route;