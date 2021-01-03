const mongoose = require('mongoose');

const messaggioSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    chat_id: String,
    mittente: String,
    testo: String,
    is_letto: { type: Boolean, default: false },
    data_ora: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Messaggio', messaggioSchema);