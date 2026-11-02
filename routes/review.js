const express = require("express");
const router = express.Router({mergeParams: true }); //Router Object Creation
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//when adding review after the route sepration, we encounter that the id is all generating and further working but that id was not moving on from app to review itself for that we use mergeParams.. see line no 2

//Delete route for review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
