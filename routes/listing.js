const express = require("express");
const router = express.Router(); //Router Object Creation
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });





//index route
router.get("/", wrapAsync(listingController.index)); //MVC jese hi router / pe req gyi to index name ka function chlega



//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);
 


//show route
router.get("/:id", wrapAsync(listingController.showListing));


//create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"), //multer file pakad ke Cloudinary pe bhejta hai, validateListing se PEHLE hona zaroori hai
  validateListing, //jab listing pe req ayega to listing ko validate kia jayega, tabhi aage ka kam chlega 
   wrapAsync (listingController.createListing)
);




//edit route
router.get(
  "/:id/edit",
   isLoggedIn,
   isOwner,
   wrapAsync(listingController.renderEditForm));




//update route
router.put("/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing));



//Delte route
router.delete("/:id",
   isLoggedIn,
   isOwner,
    wrapAsync(listingController.deleteListing));



module.exports = router;