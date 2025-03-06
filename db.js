/* eslint-disable no-unused-vars */
// const mongoose = require('mongoose');

// const connectDatabase = async () => {
//   const connection = await mongoose.connect("mongodb://127.0.0.1:27017/goFood").catch((error) => error);
  
//   if (connection instanceof Error) {
//     console.error("Error connecting to the database:", connection);
//   } else {
//     console.log("Database connected successfully");
    
//     try {
//       const fetch_data = mongoose.connection.db.collection("food_items");
//       const data = await fetch_data.find({}).toArray(async function (err,data){
//         const foodCategory = await mongoose.connection.db.collection("foodCategory");
//         foodCategory.find({}).toArray(function (err,catData){
//           if(err){
//             console.log(err);
//           }else{
//            global.food_items = data;
//            global.foodCategory = catData;
//           }
//         })
//       });
//     } catch (error) {
//       console.error("Error fetching data from collection:", error);
//     }
//   }
// };

// module.exports = connectDatabase;


const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect( "mongodb+srv://mohdmustafa969:mustafa969@cluster0.2mwbm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"    , {
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

