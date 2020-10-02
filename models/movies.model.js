const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Movie
let Movie = new Schema({
    popularity: {
        type: Number,
    },
    director: {
        type: String, required: true
    },
    genre: {
        type: [String],
    },
    imdb_score: {
        type: Number
    },
    name: {
        type: String,
       required: true
    }
});
module.exports = mongoose.model('Movie', Movie);
