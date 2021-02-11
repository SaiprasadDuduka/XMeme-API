const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const router = express.Router();
const XMeme = require("../models/XMeme");
// const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // create application/x-www-form-urlencoded parser

//ROUTES

//INDEX - show 100 latest memes
router.get("/", async (req, res) => {
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
router.post("/", urlencodedParser, async (req, res) => {
    try {
        const meme = new XMeme({
            name: req.body.name,
            url: req.body.url,
            caption: req.body.caption
        });

        try {
            const savedMeme = await meme.save();
            const formatted_res = { id: savedMeme._id }; // formatted json response
            res.status(200).json(formatted_res);
        } catch (err) {
            res.status(404).send();
        }
    } catch (err) {
        res.status(422).send("Request body missing required attributes!");
    }
});

//SHOW - show specified meme
router.get("/:id", async (req, res) => {
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
router.patch("/:id", urlencodedParser, async (req, res) => {
    try {
        const updatedMeme = await XMeme.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    url: req.body.url,
                    caption: req.body.caption
                }
            }
        );
        res.status(204).send();
    } catch (err) {
        res.status(404).send();
    }
});

//REMOVE - remove a meme
router.delete("/:id", async (req, res) => {
    try {
        const DeletedMeme = await XMeme.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch (err) {
        res.status(404).send();
    }
});

module.exports = router;
