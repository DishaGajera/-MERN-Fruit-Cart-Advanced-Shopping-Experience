const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Set up CORS middleware to allow requests from all origins (*).
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const CONNECTION_URL = "mongodb+srv://diapatel2703:Itgirl03271998@Cluster0.i0attrp.mongodb.net/ShoppingCart?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        console.log('DB is Connected');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Include the routes
const fruitsRoutes = require('./routes/fruits');
app.use('/api/fruits', fruitsRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);
