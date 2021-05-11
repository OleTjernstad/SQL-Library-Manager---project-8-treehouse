const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const { sequelize } = require('./models');

/**
 * Sync the model and db
 */
(async () => {
    await sequelize.sync();

    try {
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.locals.error = err;
    console.error(err.message);
    if (err.status == 404) {
        res.render('page-not-found');
        return;
    }
    res.locals.error.status = 500;
    res.render('error');
});

module.exports = app;
