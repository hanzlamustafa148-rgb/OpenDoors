const express = require("express");
const router = express.Router({mergeParams: true }); //Router Object Creation
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");



//review route
//post review route
router.post("/", isLoggedIn, validateReview,  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

//when adding review after the route sepration, we encounter that the id is all generating and further working but that id was not moving on from app to review itself for that we use mergeParams.. see line no 2

//Delete route for review
router.delete(
  
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //$pull MongoDB ka ek operator hai jo array me se koi specific value/document hataane ke liye use hota hai.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);


module.exports = router;
