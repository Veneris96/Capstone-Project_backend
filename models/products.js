import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false,
        min: 10
    }
}, {
    timestamps: true, strict: true
})

const ProductsModel = mongoose.model("productsModel", ProductsSchema, "products")
export default ProductsModel