const express = require("express");
const app = express();
const port = 5000;
const createUser = require("./Routes/CreateUser")
const DisplayData = require("./Routes/DisplayData")
const OrderData = require("./Routes/OrderData")
const loginRoute = require("./Routes/LoginUser");


const connectDatabase = require('./db');

connectDatabase();

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-type,Accept");
    next();
})

app.use(express.json());

app.use("/api",createUser)
app.use("/api",DisplayData)
app.use("/api",OrderData)
app.use("/api", loginRoute);

app.get("/",(req,res) =>{
    res.send("Hello, World!");
})
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})