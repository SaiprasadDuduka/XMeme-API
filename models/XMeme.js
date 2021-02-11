const mongoose = require('mongoose');

//Database SCHEMA Setup
const MemeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Memes', MemeSchema);
