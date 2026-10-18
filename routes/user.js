const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        //login after signup
        req.login(registeredUser, (err) => { //Passport ka method. Isse user ko automatically login kar diya, taaki signup ke baad dobara login na karna pade.
            if (err) {
                return next(err);
        }
        req.flash("success", "Welcome to OpenDoors!");
        res.redirect("/listings");
        });

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//login user part
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});



//isme passport authenticater khud authenticate krr lega signup user or login ka credentrials
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome to OpenDoors!");
        let redirectUrl = res.locals.redirectUrl || "/listings"; //home page se jab login krre the to page not found pe jara tha isly ye kia h 
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
});



module.exports = router;