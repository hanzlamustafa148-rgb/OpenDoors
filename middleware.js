
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");

module.exports.validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");

    throw new ExpressError(400, error);
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");

    throw new ExpressError(400, error);
  } else {
    next();
  }
}


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { //passport method   //This will check that the user is logged in or not for creating a new listing
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
   }
   next();
};

//Line no 3 explanation 
// req.originalUrl wo URL hai jahan user jaana chah raha tha (jaise /listings/new).
// req.session.redirectUrl = ... usse session me save kar leta hai, phir user ko /login bhej deta hai.
// Login ke baad us saved URL pe wapas bhej doge, to user wahi pahunchega jahan jaana tha.



module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
//Above middlware eplanation.. 
//Login ke baad user ko wapas wahi bhejne ke liye (jahan se wo aaya tha)

//Problem: login hote hi Passport session ko saaf kar deta hai,
//isliye req.session.redirectUrl gayab ho jaata hai (undefined mil jaata hai)

//Solution: session saaf hone se PEHLE value ko res.locals (local variable) me copy kar lo,
//kyunki Passport res.locals ko nahi chhuta




//authorisation - jo bhi listing h uska id and owner ka id same nhi h to

//authorisation - listing ka owner aur logged in user same nhi h to rok do
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


//whi author review delete kr skta h jo usne khud likha ho review 
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review  = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

