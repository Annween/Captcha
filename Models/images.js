const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        imageSchema: [{ img: { type: String } }],
    });

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);