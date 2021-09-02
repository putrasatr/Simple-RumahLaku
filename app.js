const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const pool = require("./dbConfig")

const indexRouter = require('./routes/index.js')(pool);
const apiIndexRouter = require('./routes/api/index.js')(pool);
const apiCoordinate = require('./routes/api/coordinate')(pool);
const apiCompare = require('./routes/api/compare')(pool);
const apiDetail = require('./routes/api/detail')(pool);
const apiAuth = require('./routes/api/auth')(pool)

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.locals.moment = require('moment');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  user: [],
  secret: "It's a secret"
}))

app.use('/', indexRouter);
app.use('/api/index', apiIndexRouter);
app.use('/api/coordinate', apiCoordinate);
app.use('/api/compare', apiCompare);
app.use('/api/detail', apiDetail);
app.use('/api/auth', apiAuth);

app.use(fileUpload());

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
