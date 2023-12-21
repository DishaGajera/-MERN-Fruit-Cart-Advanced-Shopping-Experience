const express = require('express');
const router = express.Router();
const Fruit = require('../models/fruits');

// POST route to add a new fruit
router.post('/', async (req, res) => {
    try {
        const { name, price, image } = req.body;
        const newFruit = new Fruit({ name, price, image });
        await newFruit.save();
        res.json({ message: 'Fruit added successfully' });
    } catch (err) {
        console.error('Error saving new fruit:', err);
        res.status(500).json({ error: 'Failed to add the new fruit' });
    }
});
// GET route to fetch a specific fruit by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const fruit = await Fruit.findById(id);
        if (!fruit) {
            return res.status(404).json({ error: 'Fruit not found' });
        }
        res.json(fruit);
    } catch (err) {
        console.error('Error fetching fruit:', err);
        res.status(500).json({ error: 'Failed to fetch fruit' });
    }
});

// GET route to fetch all fruits
router.get('/', async (req, res) => {
    try {
        const fruits = await Fruit.find({});
        res.json(fruits);
    } catch (err) {
        console.error('Error fetching fruits:', err);
        res.status(500).json({ error: 'Failed to fetch fruits' });
    }
});

module.exports = router;