
const express = require("express");
const app = express();
const path = require("path");
const user = require("./routes/user.js");
const post = require("./routes/post.js"); 
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));



const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;

  if (name === "anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered successfully!");
  }

  res.redirect("/hello");
});


app.get("/hello", (req, res) => {
  res.locals.successMsg = req.flash("success");
  res.locals.failureMsg = req.flash("error");
  res.render("page.ejs", { name: req.session.name });
});


// app.get("/reqcount", (req, res) => {
//    if (req.session.count) {
//      req.session.count++;
//    } else {
//      req.session.count = 1;
//    }
   
//    res.send(`You sent a request ${req.session.count} times`);
// });


// app.get("/test", (req, res) => {
//     res.send("test successful!");
// });



// app.use(cookieParser("secretcode")); //yaha secret code dete h

// app.get("/getsignedcookies", (req, res) => {
//     res.cookie("made-in", "india", {signed: true});
//     res.send("signed cookie sent");
// });

// //wo cookie ko verify krna
// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified!");
// });



// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.cookie("madeIN", "INDIA");
//     res.send("send u some cookies!");
// });


// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am Root!");
// });


// //Segregating Routes
// //ye line router object ko chlayega
// app.use("/users", user);
// app.use("/posts", post);


app.listen(3000, () => {
    console.log("server is listening to 3000");
});






