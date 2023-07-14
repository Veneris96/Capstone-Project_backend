import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const PORT = 7070
const server = express()

//middlewares
server.use(express.json())
server.use(cors())

//routes imports
import usersRoute from "./routes/users.js"
import productsRoute from "./routes/products.js"
import loginRoute from "./routes/login.js"

//routers usage
server.use("/", usersRoute)
server.use("/", productsRoute)
server.use("/", loginRoute)

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "Database connection failed"))
db.once("open", () => {
    console.log("Database connected successfully")
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`))