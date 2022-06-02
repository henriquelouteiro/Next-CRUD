import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    name: String,
    email: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.models.Client || mongoose.model('Client', ClientSchema)