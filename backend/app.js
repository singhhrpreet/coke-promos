var dotenv = require('dotenv');
var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');

dotenv.config();

var indexRouter = require('./routes/index');
var promotionsRouter = require('./routes/promotions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/dist/index.html"));
});

app.use('/api', indexRouter);
app.use('/api/promotions', promotionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
