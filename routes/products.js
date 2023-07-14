import express from "express"
import ProductsModel from "../models/products.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { validationResult } from "express-validator"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const MAX_FILE_SIZE = 20000000

const productsRouter = express.Router()

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "productImg",
        format: async (req, file) => "png" || "jpg" || "jpeg" || "gif",
        public_id: (req, file) => file.name
    }
})

const cloudUpload = multer({
    storage: cloudStorage,
    limits: { fileSize: MAX_FILE_SIZE }
})

productsRouter.get("/products", async (req, res) => {
    const { page = 1, pageSize = 4000 } = req.query
    try {
        const products = await ProductsModel.find()
            .limit(pageSize)
            .skip((page - 1) * pageSize)

        const totalProducts = await ProductsModel.count()
        res.status(200).send({
            products,
            message: "Products list downloaded.",
            statusCode: 200,
            count: totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / pageSize),
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            statusCode: 500
        })
    }
})

productsRouter.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params
        const product = await ProductsModel.findById(id)
        if (!product) {
            return res.status(404).send({
                message: "Product not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Product found",
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

productsRouter.get("/products/newgames/game&new", async (req, res) => {
    try {
        const products = await ProductsModel.find({format: "game", condition: "new"})
        if (!products) {
            return res.status(404).send({
                message: "Products not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Products found!",
            statusCode: 200,
            products
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500
        })
    }
})

productsRouter.get("/products/usedgames/:format", async (req, res) => {
    try {
        const products = await ProductsModel.find({format: "game", condition: "used"})
        if (!products) {
            return res.status(404).send({
                message: "Product not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Product found!",
            statusCode: 200,
            products
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500
        })
    }
})

productsRouter.get("/products/newconsoles/:format", async (req, res) => {
    try {
        const products = await ProductsModel.find({format: "console", condition: "new"})
        if (!products) {
            return res.status(404).send({
                message: "Product not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Product found!",
            statusCode: 200,
            products
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500
        })
    }
})

productsRouter.get("/products/usedconsoles/:format", async (req, res) => {
    try {
        const products = await ProductsModel.find({format: "console", condition: "used"})
        if (!products) {
            return res.status(404).send({
                message: "Product not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Product found!",
            statusCode: 200,
            products
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500
        })
    }
})

productsRouter.post("/products/img", cloudUpload.single("img"), async (req, res) => {
    try {
        res.status(200).json({ img: req.file.path })
    } catch (error) {
        console.error("Image upload failed." + error)
        res.status(500).send({
            message: "Image upload failed.",
            statusCode: 500
        })
    }
})

productsRouter.post("/products/new", async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array(),
            statusCode: 400
        })
    }
    const product = new ProductsModel({
        name: req.body.name,
        maker: req.body.maker,
        platform: req.body.platform,
        format: req.body.format,
        region: req.body.region,
        genre: req.body.genre,
        img: req.body.img,
        condition: req.body.condition,
        price: req.body.price,
        description: req.body.description
    })
    try {
        const addProduct = await product.save()
        res.status(201).send({
            message: "Product added successfully!",
            statusCode: 201,
            addProduct
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            statusCode: 500
        })
    }
})

productsRouter.patch("/products/:id", async (req, res) => {
    const { id } = req.params
    const productExists = await ProductsModel.findById(id)
    if (!productExists) {
        return res.status(404).send({
            message: "Product not found.",
            statusCode: 404
        })
    }
    try {
        const productId = id
        const productUpdated = req.body
        const options = { new: true }
        const result = await ProductsModel.findByIdAndUpdate(productId, productUpdated, options)
        res.status(200).send({
            message: "Product modified successfully!",
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            statusCode: 500
        })
    }
})

productsRouter.delete("/products/:id", async (req, res) => {
    const { id } = req.params
    const productExists = await ProductsModel.findById(id)
    if (!productExists) {
        return res.status(404).send({
            message: "Product not found.",
            statusCode: 404
        })
    }
    try {
        const productId = id
        const deleteProduct = req.body
        const result = await ProductsModel.findByIdAndDelete(productId, deleteProduct)
        res.status(200).send({
            message: "Product deleted successfully!",
            statusCode: 200
        })
    } catch (error) {

    }
})

export default productsRouter