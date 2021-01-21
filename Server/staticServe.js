const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '/../battleship/build')));


module.exports = app;
