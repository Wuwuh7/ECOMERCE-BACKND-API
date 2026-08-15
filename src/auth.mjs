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
    if(typeof data !== {}) {
        data = {}
    }
    if(!data.maxAge || typeof data.maxAge !== 'number') {
        data.maxAge = 3600;
    }

    data.sessionData = _.reduce(data.sessionData || {}, (memo,val,key) => {
        if(typeof val !== "function" && key !== "password") {
            memo[key] = val;
        }
        return memo;
    }, {});

    const token = jwt.sign({data:data.sessionData},keyToken,{
        expiresIn: data.maxAge,
        algorithm: 'HS256'
    });
    return token;
}