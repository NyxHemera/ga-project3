var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var homeRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var wordsRouter = require('./routes/wordcloud');

var app = express();

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
process.env.MONGODB_URI ||
'mongodb://localhost/project3';

// Connect to DB
mongoose.connect(uristring, function(err, res) {
  if(err) {
    console.log('ERROR connecting to: '+uristring+'. '+err);
  }else {
    console.log('Succeeded in connecting to: '+uristring);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'Does this do anything?' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport/passport')(passport);

// Allows us to use the currentUser in our views and routes
app.use(function(req, res, next) {
  global.currentUser = req.user;
  next();
});

app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/clouds', wordsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
