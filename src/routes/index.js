let express = require('express');
let router = express.Router();
const path = require('path');
const fs = require('fs');
const userRoute = require('./userRoute');

router.route('/').get((req, res) => {

    const filePath = path.join(__dirname, '../public/view', 'default-page.html');
    fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) return res.status(500).send('Error loading page');
        res.send(html);
    });
});

router.use('/user', userRoute);
module.exports = router;