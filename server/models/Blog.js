const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Blog', BlogSchema);
