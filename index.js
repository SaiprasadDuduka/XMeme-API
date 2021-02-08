const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGODB_URI;

//Settinp up
app.use(express.json());
app.use(express.urlencoded());

//Connecting to the database
mongoose.connect(MONGO_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to DB!");
    }
);

//Database SCHEMA Setup
const MemeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const XMeme = mongoose.model('Memes', MemeSchema);

//ROUTES

//test
app.get("/", (req,res)=>{
    res.send("Working!");
})

//INDEX - show 100 latest memes
app.get("/memes", async (req, res) => {
    try {
        var memes = await XMeme.find({}, {}, { sort: { date: -1 } }).limit(100);
        var formatted_res = [];
        memes.forEach((meme) => { // formatted json response
            var tmp = {
                id: meme._id,
                name: meme.name,
                url: meme.url,
                caption: meme.caption
            };
            formatted_res.push(tmp);
        });

        res.contentType('application/json');
        res.status(200).send(JSON.stringify(formatted_res));
    } catch (err) {
        res.status(404).send();
    }

});

//CREATE - create a new meme 
app.post("/memes", async (req, res) => {
    const meme = new XMeme({
        name: req.body.name,
        url: req.body.url,
        caption: req.body.caption
    })

    try {
        const savedMeme = await meme.save();
        const formatted_res = { id: savedMeme._id }; // formatted json response
        res.status(200).json(formatted_res);
    } catch (err) {
        console.log(err);
        res.status(404).send();
    }
});

//SHOW - show specified meme
app.get("/memes/:id", async (req, res) => {
    try {
        var meme = await XMeme.findById(req.params.id);

        var formatted_res = {
            id: meme._id,
            name: meme.name,
            url: meme.url,
            caption: meme.caption
        };

        res.status(200).json(formatted_res);
    } catch (err) {
        res.status(404).send();
    }
});

//UPDATE - update specified meme
app.patch("/memes/:id", async (req, res) => {
    try {
        const updatedMeme = await XMeme.updateOne(
            { _id: req.params.id},
            { $set: {
                url: req.body.url, 
                caption: req.body.caption
            }}
        );
        res.status(200).send();
    } catch (err) {
        res.status(404).send();
    }
});

//REMOVE - remove a meme
app.delete("/memes/:id", async (req, res) => {
    try {
        const DeletedMeme = await XMeme.remove({ _id: req.params.id});
        res.status(200).send();
    } catch (err) {
        res.status(404).send();
    }
});

//Listening on port
app.listen(port, ()=>console.log("Server has started!"));