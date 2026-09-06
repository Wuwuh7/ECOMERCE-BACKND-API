import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { range } from 'lodash';

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
        whereClause.category = {
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

export async function deletingProduct(id) {
    return await prisma.cart_item.delete({
        where: {
            id: Number(id)
        }
    })
}

export async function addStockCart(id,quantity) {
    return await prisma.cart_item.update({
        where: {
            id: Number(id)
        },
        data: {
            quantity: {increment: Number(quantity)}
        }
    })
}

export async function filteringData(category,price,size) {
    let where = {};
    if(category) {
        where.cateogory = category;
    }
    if(price) {
        let rangePrice = {
            cheap : 1000000,
            expensive : 2000000
        }

        let selectedPrice = () => {
            return price === "cheap-price" ? Math.floor(Math.random() * rangePrice.cheap): price === "normal-price" < rangePrice.expensive ? Math.floor(Math.random() * (rangePrice.expensive - rangePrice.cheap + 1) + rangePrice.cheap): price === "expensive-price" ? Math.floor(Math.random() * rangePrice.expensive):undefined;
       }; 

        switch (selectedPrice) {
            case selectedPrice <= rangePrice.cheap:
                where.price = {lte:rangePrice.cheap}
                break;
            case selectedPrice > rangePrice.cheap && selectedPrice < rangePrice.expensive:
                where.price = {
                    lt:rangePrice.expensive,
                    gt:rangePrice.cheap
                }
                break
            case selectedPrice >= rangePrice.expensive:
                where.size = {lte:rangePrice.expensive}
        }
    }
    if(size) {
       return where.size = {hasSome:size}
    }
    return await prisma.product.findMany({where})
}