/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
const session = require("express-session")
const pool = require('./database/')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const flash = require("connect-flash");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require(".//controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// Use cookie parser
app.use(cookieParser())

// Use token validation
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static);
//Index Route
// app.get("/", function (req, res) {
//   res.render("index.ejs", { title: "Home" });
// });
app.get("/", utilities.handleErrors(baseController.buildHome));

//Inventory Route
app.use("/inv", inventoryRoute);

// account route
app.use("/account", require("./routes/accountRoute"));

// inbox route
app.use("/inbox", require("./routes/messageRoute"))


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});


/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message =
      "Oops! This page has fled faster than a turtle in a hare race. Let's try to find it together!";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = /*5500;*/ process.env.PORT || 5501;
const host = /*'localhost';*/ process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});


/*
/*
user test info 
1) Name: Carlos
   Last Name: Martínez
   Email: carlos.martinez@test.com
   Password: fdP+OtM|975S

   

2) Name: Lucía
   Last Name: Fernández
   Emai:lucia.fernandez@test.com
   Password: Lucia2024#
   H81PaL5sr$[p

  3) Name: Roberto
   Last Name: Lopez 
   Emai:roberto.lopez@test.com
   Password: R0b3rt0L0p3z!

*/