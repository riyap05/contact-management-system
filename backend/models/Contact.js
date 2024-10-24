const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', 
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: false, 
    },
    phone: {
        type: String,
        required: true,
        unique: false, 
    },
    tags: {
        type: [String], 
        default: [], 
    },
    isFavorite: { 
        type: Boolean,
        default: false, 
    },
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Contact', contactSchema);
