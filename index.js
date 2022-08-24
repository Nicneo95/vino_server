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
const csurfInstance = csrf();
app.use(function (req, res, next) {

  if (req.url === '/checkout/process_payment' || req.url.slice(0, 5) == '/api/') {
    next();
  } else {
    csurfInstance(req, res, next);
  }
});

// Share CSRF with hbs files
app.use(function (req, res, next) {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next()
});
// token expire error
app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    console.log(req.flash)
    req.flash('error_messages', 'The form has expired. Please try again');
    res.redirect('back');
  } else {
    next()
  }
});

hbs.registerHelper('divide', function (leftValue, rightValue) {
  return (leftValue / rightValue)
});

const { checkIfAuthorised, modifiedUser } = require('./middlewares');

const http = {
  landingRoutes: require('./routes/landing'),
  productRoutes: require('./routes/products'),
  userRoutes: require('./routes/users'),
  cloudinaryRoutes: require('./routes/cloudinary'),
  orderRoutes: require('./routes/orders')
}

const api = {
  products: require('./routes/api/products'),
  users: require('./routes/api/users'),
  cartRoutes: require('./routes/api/cart'),
  checkoutRoutes: require('./routes/api/checkout')
}

async function main() {
  app.use('/', http.landingRoutes),
  app.use('/product-information', checkIfAuthorised, http.productRoutes);
  app.use('/user', modifiedUser, http.userRoutes);
  app.use('/order-information', checkIfAuthorised, http.orderRoutes)
  app.use('/cloudinary', http.cloudinaryRoutes);
  app.use('/cart', api.cartRoutes);
  app.use('/checkout', api.checkoutRoutes);
  app.use('/api/product', express.json(), api.products);
  app.use('/api/user', express.json(), api.users);
}

main();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});