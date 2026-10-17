const express = require("express");
const router = express.Router();


//Index - Users
router.get("/", (req, res) => {
    res.send("GET for Users");
});

//Show - user
router.get("/:id", (req, res) => {
    res.send("GET for user id");
});

//POST - users
router.post("/", (req, res) => {
    res.send("POST for users");
});

//DELETE - Users
router.delete("/:id", (req, res) => {
    res.send("DELETE for user id");
});

module.exports = router;