const app = require('./app');
const cloudinary = require('cloudinary').v2;
const connectDatabase = require('./config/db');

//Handling Uncaught Exceptions  (Undefined variable)
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);;
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

//Config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({ path: "backend/config/config.env" });    
}

//Connecting to the database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server working on http://localhost:${process.env.PORT}`);
})


//Unhandled promise rejection   (If any connection string or any server related error)
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Sutting down the server due to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    })
})
