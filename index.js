const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGODB_URI;

//import routes
const memesRoute = require("./routes/memes");

//Settinp up
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
app.listen(port, ()=>console.log("Server has started!"));
