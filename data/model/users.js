const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsersSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phonenumber: {
        type: Number
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean
    },
    create_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    update_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = Users = mongoose.model("users", UsersSchema)