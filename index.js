const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require("cors");
require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// enable cross orgin
app.use(cors());

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products')

async function main() {
    app.use('/', landingRoutes);
    app.use('/product-information', productRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});