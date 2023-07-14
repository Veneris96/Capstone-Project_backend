productsRouter.get("/products", async (req, res) => {
    const {format, condition} = req.query
    try {
        const product = await ProductsModel.find({format: "game"})
        if (!product) {
            return res.status(404).send({
                message: "Product not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Product found!",
            statusCode: 200,
            product
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500
        })
    }
})