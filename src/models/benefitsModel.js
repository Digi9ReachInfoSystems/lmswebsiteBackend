// src/models/benefitsModel.js

const mongoose = require('mongoose');

const benefitsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Benefits', benefitsSchema);
