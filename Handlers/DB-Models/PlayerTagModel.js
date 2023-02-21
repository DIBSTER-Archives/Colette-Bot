const mongo = require('mongoose');

const PlayerTagSchema = new mongo.Schema({
    Discord_ID: { type: Number, required: true, unique: false },
    Player_Tag: {type: String, required: true, unique: false },
    TimeSaved: {type: Number, required: false, unique: false }
})

const PlayerTags = mongo.model('PlayerTags', PlayerTagSchema)

module.exports = PlayerTags