const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session')

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require("./middleware/pass-user-to-view.js")


const applicationsController = require('./controllers/applications.js')
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

const path = require('path'); // styling step 2

const authController = require("./controllers/auth.js");
const { rawListeners } = require("./models/user.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public'))); //styling step 1

app.use(session ({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
})
)

app.use(passUserToView); //use new passUserToView middleware here

// GET
app.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`)
  } else {
    res.render('index.ejs')
  }
})


app.use('/auth', authController);
app.use(isSignedIn) // use new isSignedIn middleware
app.use('/users/:userId/applications', applicationsController);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
