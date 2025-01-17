const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const app = express();
const PORT = 5000;
const PORT1 = 5132;
// CORS konfigūracija
app.use(cors());

app.get('/products/:id', function (req, res, next) {
    res.json({
        msg: 'This is CORS-enabled for all origins!'
    });
});

app.listen(PORT1, function () {
    console.log(`CORS-enabled web server listening on port ${PORT1}`);
});


app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);


app.listen(PORT, () => {
    console.log(`Serveris veikia ant prievado ${PORT}`);
});