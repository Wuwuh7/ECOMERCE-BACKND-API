import express from "express";
import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

const app = express();
const port = process.env.PORT;
app.use(express.json())

app.use("/", (req,res,next) => {
    res.send("tek check sit ya");
    next();
});


app.listen(port,
    console.log("wah guanteng lanjut")
);