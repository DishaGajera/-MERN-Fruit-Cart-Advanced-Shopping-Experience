const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Fruit = require('../models/fruits');
const authenticateUser = require('../middleWares/authMiddleware');
const jwt = require('jsonwebtoken');
const secretKey = '70422b875dd08af73d158a04e6507d17c88acdae96857abfeca1841d6283723b';
const mongoose = require('mongoose');


// POST route to add a new user
router.post('/', async (req, res) => {
    try {
        const { id, pwd, cpwd, sex, age, cart } = req.body;
        const newUser = new User({ id, pwd, cpwd, sex, age, cart });
        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error saving new user:', err);
        res.status(500).json({ error: 'Failed to create the new user' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/current-user', authenticateUser, (req, res) => {

    currentuserID = req.user.id;

    User.findOne({ id: currentuserID })
        .populate('cart.fruitId', 'name price')
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            } else {
                res.json({ userId: user.id, cart: user.cart });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Error fetching current user' });
        });

});


router.post('/add-to-cart', async (req, res) => {
    const { userId, fruitId } = req.body;
    console.log(userId + ' - ' + fruitId);

    try {
        const user = await User.findOne({ id: userId }).populate('cart.fruitId', 'name price');
        console.log(user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingCartItem = user.cart.find(item => item.fruitId.toString() === fruitId);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            const fruit = await Fruit.findById(fruitId); // Assuming you have a Fruit model
            if (!fruit) {
                return res.status(404).json({ error: 'Fruit not found' });
            }

            user.cart.push({
                fruitId,
                quantity: 1,
                name: fruit.name,
                price: fruit.price,
            });
        }

        await user.save();
        res.json({ cart: user.cart });

    } catch (error) {
        res.status(500).json({ error: 'Error adding item to cart' });
    }
});

router.post('/login', async (req, res) => {
    const { id, pwd } = req.body;

    try {
        const user = await User.findOne({ id, pwd });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' }); // Generate token
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


// Fetch cart data for a specific user
router.get('/:userId/cart', authenticateUser, async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ id: userId }).populate('cart.fruitId', 'name price');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ cart: user.cart });
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ error: 'Error fetching user cart' });
    }
});



module.exports = router;