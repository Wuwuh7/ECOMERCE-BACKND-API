import express from "express";
import  route  from "./routes.mjs";
import { userDb } from "./service.mjs";
import expressBasicAuth from "express-basic-auth";

const app = express();
const port = 8080;
app.use(express.json())
app.use("/", (req, res, next) => {
    next();
});

async function checkAuth(req,res,next) {
    const authentication = expressBasicAuth(req);
    const { email,password } = userDb;

    if (!authentication.email && authentication.email !== email && !authentication.password && authentication.password !== password) {
        res.set('WWW-Authenticate', 'Basic realm ="example"');
        return res.status(401).send('Unauthorized');
    } else {
        next();
}
}

app.get("/auth",checkAuth, (req,res) => {
    res.send("MONGGOH MASSEH");
})
app.use("/", route);


app.listen(port, '0.0.0.0', () => {
    console.log("wah guanteng lanjut")
});