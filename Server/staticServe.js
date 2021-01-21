module.exports = () => {
    const express = require('express');
    const app = express();
    const path = require('path');
    const PORT = 80;
    app.use(express.static(path.join(__dirname, '/../battleship/build')));
    

    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

}