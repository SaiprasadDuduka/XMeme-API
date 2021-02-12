const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const XMeme = require("../models/XMeme");
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false }); // create application/x-www-form-urlencoded parser

/**
 * @swagger
 * definitions:
 *  Meme_post:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *              description: Meme owner Name
 *              example: Saiprasad Duduka
 *          caption:
 *              type: string
 *              description: Meme Caption
 *              example: Class of 2020
 *          url:
 *              type: string
 *              description: Meme Image URL
 *              example: https://i.redd.it/ay7f9jbkram41.jpg
 *  Meme_patch:
 *      type: object
 *      properties:
 *          caption:
 *              type: string
 *              description: Meme Caption
 *              example: Class of 2020
 *          url:
 *              type: string
 *              description: Meme Image URL
 *              example: https://i.redd.it/ay7f9jbkram41.jpg 
 */

//ROUTES

//INDEX - show 100 latest memes
/**
 * @swagger
 * /memes:
 *  get:
 *      servers:
 *        - url: http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:8081
 *      summary: get latest 100 memes
 *      description: Use to request latest 100 memes
 *      responses:
 *          '200':
 *              description: Successful response with json file containing memes
 *          '404':
 *              description: Page not found or server error
 */
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
/**
 * @swagger
 * /memes:
 *  post:
 *      servers:
 *        - url: http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:8081
 *      summary: Post meme
 *      description: Use to post a meme
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Meme_post'
 *      responses:
 *          '200':
 *              description: Successful response with json file containing memes
 *          '404':
 *              description: Page not found or server error
 *          '409':
 *              description: Duplicate post
 *          '422':
 *              description: Request body missing required attributes
 */
router.post("/", jsonParser, async (req, res) => {
    try {
        let newMeme = {
            name: req.body.name,
            url: req.body.url,
            caption: req.body.caption
        };

        XMeme.exists(newMeme, async (err, doc) => {
            if (err) {
                res.sendStatus(404);
            } else {
                if (!doc) {
                    const meme = new XMeme(newMeme);

                    try {
                        const savedMeme = await meme.save();
                        const formatted_res = { id: savedMeme._id }; // formatted json response
                        res.status(200).json(formatted_res);
                    } catch (err) {
                        res.status(404).send();
                    }
                } else {
                    res.status(409).send("Meme already exists");
                }
            }
        });

    } catch (err) {
        res.status(422).send("Request body missing required attributes!");
    }
});

//SHOW - show specified meme
/**
 * @swagger
 * /memes/{id}:
 *  get:
 *    servers:
 *        - url: http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:8081
 *    summary: Get a meme by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: ID of the meme to get
 *    responses:
 *     '200':
 *          description: Successful response with json file containing the specific meme
 *     '404':
 *          description: Meme doesn't exist
 */
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
/**
 * @swagger
 * /memes/{id}:
 *  patch:
 *      servers:
 *        - url: http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:8081
 *      summary: Update meme
 *      description: Update caption and/or url of the meme
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: ID of the meme to get
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Meme_patch'
 *      responses:
 *          '204':
 *              description: Successfully updated the meme
 *          '404':
 *              description: Meme doesn't exist
 *          '409':
 *              description: Duplicate post
 *          '422':
 *              description: Request body missing required attributes
 */
router.patch("/:id", jsonParser, async (req, res) => {
    try {
        const memeName = XMeme.findById(req.params.id);
        let newMeme = {
            name: memeName.name,
            url: req.body.url,
            caption: req.body.caption
        };
        
        XMeme.exists(newMeme, async (err, doc) => {
            if (err) {
                res.sendStatus(404);
            } else {
                if (!doc) {
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
                } else {
                    res.status(409).send("Meme already exists");
                }
            }
        });
    } catch (err) {
        res.status(404).send();
    }
});

//REMOVE - remove a meme
/**
 * @swagger
 * /memes/{id}:
 *  delete:
 *    servers:
 *        - url: http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:8081
 *    summary: Delete a user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: ID of the meme to delete
 *    responses:
 *     '204':
 *          description: Deleted successfully
 *     '404':
 *          description: Meme doesn't exist
 */
router.delete("/:id", async (req, res) => {
    try {
        const DeletedMeme = await XMeme.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch (err) {
        res.status(404).send();
    }
});

module.exports = router;
