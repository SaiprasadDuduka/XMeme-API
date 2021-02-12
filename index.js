const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT;
const swagger_port = process.env.SWAGGER_PORT;
const MONGO_CONNECTION_STRING = process.env.MONGODB_URI;
const cors = require('cors');
const swagger_app = require('./swagger_api');

//import routes
const memesRoute = require("./routes/memes");

//Settinp up app uses
app.use("/memes", memesRoute);
app.use(cors());

//Connecting to the database
mongoose.connect(MONGO_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to DB!");
    }
);

//Listening on port
app.listen(port, () => console.log("Server has started!"));
swagger_app.listen(swagger_port, ()=>console.log("Swagger-API has started"));

