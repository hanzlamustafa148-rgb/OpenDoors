const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/opendoors";

// [category, title, location, country, price, lat, lng]
const rows = [
  ["Trending", "Sunset Villa", "Goa", "India", 6500, 15.4909, 73.8278],
  ["Trending", "Skyline Loft", "Mumbai", "India", 8200, 19.076, 72.8777],
  ["Trending", "Lakeview Retreat", "Udaipur", "India", 5400, 24.5854, 73.7125],

  ["Rooms", "Cozy Studio Room", "Jaipur", "India", 1800, 26.9124, 75.7873],
  ["Rooms", "Heritage Ghat Room", "Varanasi", "India", 2200, 25.3176, 82.9739],
  ["Rooms", "Garden Room", "Kochi", "India", 2500, 9.9312, 76.2673],

  ["Iconic cities", "Old Delhi Haveli", "Delhi", "India", 4500, 28.6562, 77.241],
  ["Iconic cities", "Taj View Stay", "Agra", "India", 5200, 27.1751, 78.0421],
  ["Iconic cities", "Pink City Apartment", "Jaipur", "India", 3800, 26.9239, 75.8267],

  ["Mountains", "Himalayan Cabin", "Manali", "India", 3800, 32.2396, 77.1887],
  ["Mountains", "Hill Cottage", "Darjeeling", "India", 3000, 27.041, 88.2663],
  ["Mountains", "Pine Valley Stay", "Mussoorie", "India", 3300, 30.4598, 78.0644],

  ["Castles", "Rajwada Fort Stay", "Jodhpur", "India", 9500, 26.2389, 73.0243],
  ["Castles", "Royal Palace Suite", "Mysore", "India", 7800, 12.2958, 76.6394],
  ["Castles", "Lake Palace Haveli", "Udaipur", "India", 11000, 24.5764, 73.6835],

  ["Amazing pools", "Infinity Pool Villa", "Alibaug", "India", 12500, 18.6414, 72.8722],
  ["Amazing pools", "Private Pool House", "Lonavala", "India", 7000, 18.7546, 73.4062],
  ["Amazing pools", "Resort Pool Suite", "Goa", "India", 9000, 15.2993, 74.124],

  ["Camping", "Riverside Camp", "Rishikesh", "India", 2000, 30.0869, 78.2676],
  ["Camping", "Forest Camp", "Coorg", "India", 2600, 12.4244, 75.7382],
  ["Camping", "Meadow Tents", "Kaza, Spiti", "India", 2400, 32.2461, 78.0349],

  ["Farms", "Organic Farmstay", "Ludhiana", "India", 2800, 30.901, 75.8573],
  ["Farms", "Tea Estate Bungalow", "Munnar", "India", 4500, 10.0889, 77.0595],
  ["Farms", "Apple Orchard Cottage", "Shimla", "India", 3500, 31.1048, 77.1734],

  ["Arctic", "Snow Igloo Stay", "Gulmarg", "India", 6500, 34.0484, 74.3805],
  ["Arctic", "Glacier View Hut", "Auli", "India", 4800, 30.5267, 79.5688],
  ["Arctic", "Frozen Lake Cabin", "Leh", "India", 5500, 34.1526, 77.5771],

  ["Domes", "Glass Dome Stay", "Kasol", "India", 4200, 32.01, 77.315],
  ["Domes", "Geodesic Dome", "Pushkar", "India", 3900, 26.49, 74.5513],
  ["Domes", "Starview Dome", "Bir", "India", 3600, 32.0426, 76.7211],

  ["Boats", "Kerala Houseboat", "Alleppey", "India", 6000, 9.4981, 76.3388],
  ["Boats", "Dal Lake Houseboat", "Srinagar", "India", 5200, 34.0837, 74.7973],
  ["Boats", "Backwater Boat Stay", "Kumarakom", "India", 5800, 9.6177, 76.4303],

  ["Desert", "Dune Camp", "Jaisalmer", "India", 3600, 26.9157, 70.9083],
  ["Desert", "Sand Dunes Tent", "Bikaner", "India", 3200, 28.0229, 73.3119],
  ["Desert", "Thar Desert Camp", "Khuri", "India", 3400, 26.8, 70.7],

  ["Beach", "Beach Hut", "Gokarna", "India", 2700, 14.5479, 74.3188],
  ["Beach", "Seaside Villa", "Varkala", "India", 4600, 8.7379, 76.7163],
  ["Beach", "Sea Breeze Cabana", "Pondicherry", "India", 4100, 11.9416, 79.8083],
];

async function seed() {
  await mongoose.connect(MONGO_URL);
  const owner = await User.findOne();
  if (!owner) {
    console.log("Pehle ek user signup karo, phir ye script chalao.");
    return;
  }

  const docs = rows.map(([category, title, location, country, price, lat, lng], i) => ({
    title: `${title}, ${location}`,
    description: `Comfortable ${category.toLowerCase()} stay in ${location}, ${country}. Clean, well located and perfect for a relaxing getaway.`,
    image: {
      filename: "seed_" + i,
      url: `https://picsum.photos/seed/opendoors${i}/800/600`,
    },
    price,
    location,
    country,
    category,
    owner: owner._id,
    geometry: { type: "Point", coordinates: [lng, lat] },
  }));

  await Listing.insertMany(docs);
  console.log(docs.length + " listings add ho gayi");
}

seed()
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());