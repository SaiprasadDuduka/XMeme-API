const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swagger_app = express();

//setting up swagger
const swaggerOptions = {
    swagger: '2.0',
    definition:{
        openapi: '3.0.0',
        info:{
            version: "1.0.0",
            title: "XMeme API",
            description: "Get, post, update and delete Memes",
            contact:{
                name: "Saiprasad Duduka",
                email: "dsp221099@gmai.com"
            }
        }
    },
    apis: ["./routes/memes.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
swagger_app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = swagger_app;