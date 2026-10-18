const express = require("express");
const router = express.Router(); //Router Object Creation
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");








//index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}); //listing.find ka mltb "listing" to model hogya, find({}) is ur db me find kro or uske andr koi condition nhi h to sabhi listings milengi 
  res.render("listings/index.ejs", { allListings });

}));


//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
 


//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }) //reviews ka info + har review ka author ka info bhi (nested populate)
    .populate("owner");

  if(!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {listing});

}));


//create route
router.post(
  "/",
  isLoggedIn,
  validateListing, //jab listing pe req ayega to listing ko validate kia jayega, tabhi aage ka kam chlega 
   wrapAsync (async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //new listing add krte time current user jo logged in ho whi store hoo
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
   })
);




//edit route
router.get(
  "/:id/edit",
   isLoggedIn,
   isOwner,
   wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));




//update route
router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", " Listing Updated!");
  res.redirect(`/listings/${id}`);//show wale route pr redirect hojyega

}));



//Delte route
router.delete("/:id",
   isLoggedIn,
   isOwner,
    wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
}));



module.exports = router;