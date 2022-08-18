const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
var helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
});
const cors = require("cors");
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')
require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// enable cross orgin
app.use(cors());

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));



// enable flash
app.use(flash());

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next()
});

// Share the user data with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
})

// enable CSRF
app.use(csrf());

// Share CSRF with hbs files
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next()
});

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    console.log(req.flash)
    req.flash('error_messages', 'The form has expired. Please try again');
    res.redirect('back');
  } else {
    next()
  }
});

const { checkIfAuthorised, modifiedUser } = require('./middlewares');

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary');

async function main() {
  app.use('/', landingRoutes);
  app.use('/product-information', checkIfAuthorised, productRoutes);
  app.use('/user', modifiedUser, userRoutes);
  app.use('/cloudinary', cloudinaryRoutes)
}

main();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});