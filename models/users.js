import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    cap: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: "user"
    }
}, {
    timestamps: true, strict: true
})

const UserModel = mongoose.model("userModel", UserSchema, "users")
export default UserModel