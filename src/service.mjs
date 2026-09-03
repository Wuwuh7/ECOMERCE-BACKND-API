import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


export const userDb = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email:email
        }
    })
    return user;
}
export const findCartId = async (id) => {
    await prisma.cart.findUnique({
        where: {
            id: Number(id)
        }
    })
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

export async function addCart(item,user) {
    return await prisma.$transaction(async (data) => {
    const cart = await data.cart.upsert({
        where: {userId:user},
        update: {},
        create:{userId:user}
    });
    const cartInsert = await data.cart_item.upsert({
        where:{
            cartId_productId: {
            cartId: cart.id,
            productId: item.productId
        }},
        update:{
            quantity:{increment:item.quantity}
        },
        create: {
            cartId: cart.id,
            productId:item.productId,
            quantity: item.quantity
        }
    });
    return cartInsert;
})
}