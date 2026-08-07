
export const controlerFilter = async (req,res) => {
    const { category,price,size,rating } = req.query;
    const resultFilter = await filteringData(category,price,size,rating);
    res.send({
        status : "dadi boss",
        result : resultFilter
    });
}

export const controlerDetailProducts = async (req,res) => {
    const { id } = req.params.id;
    const resultDetail = await detailingProduct(id);
    res.send({
        status: "detaile kieh",
        result: resultDetail
    })
}

export const controlerAddCart = async (req,res) => {
    const { items } = req.body;
    const resultAddCart = await addCart(items);
    res.send({
        status: "tambah kieh cart mu",
        result: resultAddCart
    })
}

export const controlerAddStock = async (req,res) => {
    const { id,quantity } = req.body;
    const resultAddStock = await addStockCart(id,quantity);
    res.send({
        status:"nambah stock guyss",
        result: resultAddStock
    })
}

export const controlerSearch = async (req,res) => {
    let dataSearched = {
        name: req.query,
        category: req.query,
        price: req.query,
        size: req.query,
        rating: req.query
    }
    const resultSearch = await searchingProducts(dataSearched)
    res.send({
        status:"kieh sing ko golet",
        result:resultSearch
    })
}