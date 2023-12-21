const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    pwd: { type: String, required: true },
    cpwd: { type: String, required: true },
    sex: { type: String, required: true },
    age: { type: Number, required: true },
    cart: [
        {
            fruitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fruit' },
            quantity: { type: Number, required: true },
            name: { type: String, required: true },   // Add this field
            price: { type: Number, required: true },
        }
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;