const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId, //Har Review document ka MongoDB automatically ek _id banata hai., Phir Listing ke reviews array mein usi Review ki _id store hoti hai:
      ref: "Review",
    },
  ],
});


//jab hamra delete route listing ka trigger hoga to ye middlwear chlega 
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: {$in: listing.reviews } });
  }
});
//Mongoose ka rule hai: schema middleware hamesha us model ki file me likha jaata hai jiske schema pe wo attach ho raha hai.




const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;