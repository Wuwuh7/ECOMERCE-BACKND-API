import { userDb } from "./service.mjs";
import expressBasicAuth from "express-basic-auth";

export async function checkAuth(req,res,next) {
    const authentication = expressBasicAuth(req);
    const { email,password } = userDb;

    if (!authentication.email && authentication.email !== email && !authentication.password && authentication.password !== password) {
        res.set('WWW-Authenticate', 'Basic realm ="example"');
        return res.status(401).send('Unauthorized');
    } else {
        next();
    }
}