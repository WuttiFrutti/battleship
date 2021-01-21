module.exports = () => {
    const express = require('express');
    const app = express();
    const PORT = 3000;

    app.use(express.static('../battleship/build/public'));
}