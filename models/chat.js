const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    utenti : [String],
    last_mex: {type: String, default: ""}
});

module.exports = mongoose.model('Chat', chatSchema);