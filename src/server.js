// The first file accessed
require('dotenv').config();
require('./models/dbInit');

const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const app = express();
const port = process.env.PORT || 5000;

const register = require('./routes/register.js');
const callback = require('./routes/accountsCallback.js');
const game = require('./routes/game.js');
const admin = require('./routes/admin.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '/static')));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'eiffel tower on steoroids',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: { maxAge: 12 * 60 * 60 * 100 },
    }),
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', register);
app.use('/oauth/redirect', callback);
app.use('/game', game);
app.use('/admin', admin);

app.use('*', (req, res) => {
    res.render('error', { error: `${req.originalUrl} is not defined` });
});

app.listen(port, () => {
    console.log(`server started at ${port}`);
});
