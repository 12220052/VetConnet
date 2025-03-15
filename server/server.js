const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

require('dotenv').config();
const mongoose = require('mongoose');

const bannerUpload = require("./routes/cloudinary")


// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection error:', err));

// Routes
app.use(bannerUpload);


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('listening on 8080');
});
