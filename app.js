var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog'); 
var compression = require('compression');
var helmet = require('helmet');


var app = express();

//Set up default mongoose connection 
var dev_db_url = "mongodb+srv://firefox:mongodb13@cluster0.3citq.mongodb.net/local_library?retryWrites=true&w=majority"
var mongoDB = process.env.MONGODB_URI || dev_db_url;


mongoose.connect(mongoDB, {userNewUrlParse: true}); 

//get default connection 
var db = mongoose.connection; 

//bind connection to error event (to get notifcation of connection errors)
db.on('error', console.error.bind(console,'MongoDB connection error:')); 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog',catalogRouter); 




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
