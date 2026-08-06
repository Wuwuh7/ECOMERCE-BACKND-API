import express from "express";
import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

const app = express();
const port = process.env.PORT;

app.get("/", (req,res) => {
    res.send("kena kieh")
});

app.listen(port,
    console.log("wah guanteng lanjut")
);