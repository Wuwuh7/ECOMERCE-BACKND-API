import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function detailingProduct(id) {
   try {
    const key = Number(id);
    const detailingProces = await prisma.Product.findUnique({
        where: { id:key },
    });
    return detailingProces;
   } catch (error) {
    console.log(error)
   }
}

export async function searchingProducts(data) {
     const formattedSearch = data.toString()
    .trim()
    .split(/\s+/)
    .map(word => `${word}:*`)
    .join(' & ');

    const searchProcess = await prisma.product.findMany({
        where: {
            OR:[
                {name: {contains:formattedSearch, mode:"insensitive"}},
                {category: {contains:formattedSearch, mode:"insensitive"}},
                {size   : {contains:formattedSearch,mode:"insensitive"}},
                {price  : {contains:formattedSearch,mode:"insensitive"}},
                {rating : {contains:formattedSearch,mode:"insensitive"}}
            ]
        }
    });
    return searchProcess;
}