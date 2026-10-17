
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash  = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



//DataBase Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/opendoors";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(MONGO_URL);

}



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //ONE week 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//Root API
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash());


//Middlweare to initialse Passport or isko session me hi krnge passport ko
app.use(passport.initialize()); // Passport ko initialize karta hai taaki authentication use ho sake
app.use(passport.session()); // User ka login session maintain karta hai
passport.use(new LocalStrategy(User.authenticate())); // Username aur password verify karne ki strategy set karta hai

passport.serializeUser(User.serializeUser()); // User ki ID session mein store karta hai
passport.deserializeUser(User.deserializeUser()); // Session ki ID se user ki details wapas nikalta hai





//middlweare
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "abc");
//   res.send(registeredUser);
// });



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



//base response for route 
app.all("*name", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});



//middlweare for error handling
app.use((err, req, res, next) => {
  let {statusCode=500, message="something went wrong"} = err;
  res.status(statusCode).render("error.ejs", { message });
  //res.status(statusCode).send(message);
});



app.listen(8080, () => {
    console.log("server is listening to port 8080");
});