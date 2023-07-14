import express from "express"
import UserModel from "../models/users.js"
import bcrypt from "bcrypt"
import validateUser from "../middlewares/validateUser.js"
import cacheMiddleware from "../middlewares/cache.js"

const usersRouter = express.Router()

usersRouter.get("/users", cacheMiddleware, async (req, res) => {
    const { page = 1, pageSize = 10} = req.query
    try {
        const users = await UserModel.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize)

        const totalUsers = await UserModel.count()
        res.status(200).send({
            count: totalUsers,
            currentPage: + page,
            totalPages: Math.ceil(totalUsers / pageSize),
            users,
            message: "Users list downloaded."
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error."
        })
    }
})

usersRouter.post("/users/new", validateUser, async (req, res) => {
    const genSalt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, genSalt)

    const user = new UserModel({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        cap: req.body.cap,
        role: req.body.role
    })
    try {
        const userExists = await UserModel.findOne({ email: req.body.email })
        if (userExists) {
            return res.status(409).send({
                message: "This e-mail address is already associated to an account, please use another one.",
                statusCode: 409 
            })
        }
        const newUser = await user.save();
        res.status(201).send({
            message: "Account created successfully.",
            statusCode: 201,
            payload: newUser
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            statusCode: 500
        })
    }
})

usersRouter.patch("/users/:id", async (req, res) => {
    const { id } = req.params
    const userExists = await UserModel.findById(id)
    if(!userExists) {
        return res.status(404).send({
            message: "User not found.",
            statusCode: 404
        })
    }
    try {
        const userId = id
        const dataUpdated = req.body
        const options = { new:true }
        const result = await UserModel.findByIdAndUpdate(userId, dataUpdated, options)
        res.status(200).send({
            message: "Account info updated successfully!",
            statusCode: 200
        })        
    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            statusCode: 500
        })
    }
})

usersRouter.delete("/users/:id", async (req, res) => {
    const { id } = req.params
    try {
        const userExists = await UserModel.findByIdAndDelete(id)
        if (!userExists) {
            return res.status(404).send({
                message: "User not found.",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: `Account deleted successfully! (id ${id})`,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error.",
            statusCode: 500
        })
    }
})

export default usersRouter
