import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export const userDb = async () => {
    return await prisma.user.findMany() 
}

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
    const whereClause = {};

    if(data.name && String(data.name).trim() !== "") {
        whereClause.name = {
            contains: String(data.name).trim(),
            mode: "insensitive"
        }
    }

    if(data.category && String(data.category).trim() !== "") {
        whereClause.name = {
            contains: String(data.category).trim(),
            mode: "insensitive"
        }
    }

    if(data.price !== undefined && data.price !== null) {
        const parsedPrice = parseInt(data.price, 10);
        if(!Number.isNaN(parsedPrice)) {
            whereClause.price = {
                equals: parsedPrice,
            }
        }
    }

    if(data.size !== undefined && data.size !== null) {
        const parsedSize = parseInt(data.size, 10);
        if(!Number.isNaN(parsedSize)) {
            whereClause.size = {
                has: parsedSize,
            }
        }
    }

    return await prisma.product.findMany({
        where:whereClause
    })
   
}