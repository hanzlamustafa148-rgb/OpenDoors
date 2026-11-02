const Listing = require("../models/listing");
const geocode = require("../utils/geocode.js");



//Index Route MVC
module.exports.index = async (req, res) => {
  const { category, q } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (q && q.trim()) {
    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safe, "i");
    filter.$or = [{ title: regex }, { location: regex }, { country: regex }];
  }
  const allListings = await Listing.find(filter); //listing.find ka mltb "listing" to model hogya, find({}) is ur db me find kro or uske andr koi condition nhi h to sabhi listings milengi 
  res.render("listings/index.ejs", { allListings, category, q });

}

//New  Route MVC
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


//Show Listing Route MVC
module.exports.showListing = async (req, res) => {
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

};


//New Listing Route MVC
module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }

  //location se coordinates nikalke save karo
  const geometry = await geocode(req.body.listing.location, req.body.listing.country);
  if (geometry) {
    newListing.geometry = geometry;
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
//Edit Route MVC
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};


//Update Listing Route MVC
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  const geometry = await geocode(req.body.listing.location, req.body.listing.country);
  if (geometry) {
    listing.geometry = geometry;
  }
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


//Delete Listing Route MVC
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};