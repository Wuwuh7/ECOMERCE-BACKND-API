import { detailingProduct,searchingProducts } from "./service.mjs"

let dataHelper = (query) => {
        const {name,category,price,size,rating} = query;
        return {name,category,price,size,rating};
}

export const controlerFilter = async (req,res) => {
    const { category,price,size,rating } = req.query;
    const resultFilter = await filteringData(category,price,size,rating);
    return res.json({
        status : "dadi boss",
        result : resultFilter
    });
}

export const controlerDetailProducts = async (req,res) => {
  try {
    const { id } = req.params;
    const resultDetail = await detailingProduct(id);
    return res.json({
        status: "detaile kieh",
        result: resultDetail
    })
  } catch (error) {
console.log(error);
    return res.status(500).json({ status: "error", message: error.message });  }
}

export const controlerAddCart = async (req,res) => {
    const { items } = req.body;
    const resultAddCart = await addCart(items);
    return res.json({
        status: "tambah kieh cart mu",
        result: resultAddCart
    })
}

export const controlerDeleteCart = async (req,res) => {
  try {
    const { id } = req.params;
    const resultDelete = await deletingProduct(id);
    return res.json({
        status: "tek apus ya",
        result: resultDelete
    })
  } catch (error) {
    console.log(error)
  }
}

export const controlerAddStock = async (req,res) => {
    const { id,quantity } = req.body;
    const resultAddStock = await addStockCart(id,quantity);
    res.json({
        status:"nambah stock guyss",
        result: resultAddStock
    })
}

export const controlerSearch = async (req,res) => {
    let dataSearched = dataHelper(req.query)
    const resultSearch = await searchingProducts(dataSearched)
    res.json({
        status:"kieh sing ko golet",
        result:resultSearch
    })
}