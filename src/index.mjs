import express from "express";
import  route  from "./routes.mjs";

const app = express();
const port = 8080;
app.use(express.json())
app.use("/", (req, res, next) => {
    next();
});

app.use("/", route);


app.listen(port, '0.0.0.0', () => {
    console.log("wah guanteng lanjut")
});