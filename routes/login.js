import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import UserModel from "../models/users.js"

const login = express.Router()

login.post("/login", async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send({
            message: "User not found.",
            statusCode: 404
        })
    }
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send({
            message: "Wrong username or password.",
            statusCode: 400
        })
    }
    
    const token = jwt.sign({
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        address: user.address,
        role: user.role,
        id: user._id
    }, process.env.SECRET_JWT_KEY, {
        expiresIn: "24h"
    })
    return res.header("auth", token).status(200).send({
        token
    }) 
})

export default login