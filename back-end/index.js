const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Router = require('./routes/routes');
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cors());
app.use(Router);

const DbCnx = mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true});

DbCnx.then((res) => app.listen(process.env.PORT));
