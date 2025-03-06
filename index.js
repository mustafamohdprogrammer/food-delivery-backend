const express = require("express");
const app = express();
const port = 5000;
const createUser = require("./Routes/CreateUser");
const DisplayData = require("./Routes/DisplayData");
const OrderData = require("./Routes/OrderData");
const loginRoute = require("./Routes/LoginUser");

const connectDatabase = require('./db');

connectDatabase();

// Middleware for handling CORS
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:3000", // Local development
        "https://mustafasbistro.vercel.app", // Deployed frontend
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true"); // If using cookies or credentials
    next();
});

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api", createUser);
app.use("/api", DisplayData);
app.use("/api", OrderData);
app.use("/api", loginRoute);

// Test Route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
