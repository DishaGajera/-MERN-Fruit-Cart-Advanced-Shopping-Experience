const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;