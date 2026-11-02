const User = require("../models/user.js");

//signup form render
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

//signup
module.exports.signup = async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);

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
};

//login form render
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to OpenDoors!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //home page se jab login krre the to page not found pe jara tha isly ye kia h
    res.redirect(redirectUrl);
};

//logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};