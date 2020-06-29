const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(80, '0.0.0.0', (req, res) => {
    console.log('Speedcube Timer listening on port 80');
})