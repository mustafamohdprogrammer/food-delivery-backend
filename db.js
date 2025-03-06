const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");

    // Fetch data from the collections
    const foodItemsCollection = mongoose.connection.db.collection("food_items");
    const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");

    const foodItems = await foodItemsCollection.find({}).toArray();
    const foodCategories = await foodCategoryCollection.find({}).toArray();

    // Set data globally
    global.food_items = foodItems;
    global.foodCategory = foodCategories;
  } catch (error) {
    console.error("Error connecting to the database or fetching data:", error);
    throw error; // Re-throw the error for further handling
  }
};

module.exports = connectDatabase;
