import express from "express";
import { controlerAddCart,controlerDetailProducts,controlerSearch,controlerAddStock,controlerFilter } from "./controler.mjs";

const route = express.Router();

route.get("/product/:id", (req,res) => {
    res.send("detail product kieh")
});

route.get("/filter",(req,res) => {
    res.send("khususon koe")
});

route.post("/cart", (req,res) => {
    res.send("gletaka keranjang kieh")
})

route.delete("/cart", (req,res) => {
    res.send("hapus barang ning cart ya")
})

route.post("/quantity", (req,res) => {
    res.send("tek tambah stoke yak")
});

route.get("/search", (req,res) => {
    res.send("kieh sing ko geleti")
});

