

const express = require("express");
const router = express.Router();

router.post("/foodData", (req, res) => {
  try {
    if (global.food_items && global.foodCategory) {
      res.status(200).send([global.food_items, global.foodCategory]);
    } else {
      res.status(500).send("Data not loaded yet");
    }
  } catch (error) {
    console.error("Error in /foodData route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;


