require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/opendoors";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "6aeca4fdad6d4bc992c585a0"}));
  await Listing.insertMany(initData.data);//object tha data.js m
  console.log("data was initialized");
};

initDB();