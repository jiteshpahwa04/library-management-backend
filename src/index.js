const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-tau.vercel.app', "*"],
    credentials: true
}))
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/communityRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const itemRoutes = require('./routes/itemRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/item', itemRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));