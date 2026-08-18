import 'dotenv/config'
import jwt from 'jsonwebtoken'
import _ from 'lodash';

const keyToken = process.env.JWT_SECRET;

export async function verifyJWT(token) {
    return await new Promise((resolve,reject) => {
        return jwt.verify(token, keyToken,(err,decode) => {
          if(err) {
            reject(err.message)
          } else {
            resolve(decode)
          }
        })
    })
}

export async function createToken(data) {
    console.log(data);
    if(typeof data !== "object") {
        data = {}
    }
    if(!data.maxAge || typeof data.maxAge !== 'number') {
        data.maxAge = 3600;
    }
    const rawSource = data.sessionData ? data.sessionData : data;
    const targetSession = JSON.parse(JSON.stringify(rawSource || {}));

    const payload = _.reduce(targetSession, (memo,val,key) => {
        console.log(`-> Loop Key: "${key}" | Type Val: ${typeof val} | Val:`, val);
        if(typeof val !== "function" && key !== "password") {
            memo[key] = val;
             console.log(`2.-> Loop Key: "${key}" | Type Val: ${typeof val} | Val:`, val);
        }
        return memo;
    }, {});

    const token = jwt.sign({ payload },keyToken,{
        expiresIn: data.maxAge,
        algorithm: 'HS256'
    });
    return token;
}