const mongoose = require('mongoose');

const utenteSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username: String,
    password: String,
    ultimo_accesso: { type: Date, default: () => Date.now()},
    open_chat: {type: String, default: 'none'},
    socket_id: {type: String, default: 'none'},
    is_online: {type: Boolean, default: false},
    chat_id: [String]
});

module.exports = mongoose.model('Utente', utenteSchema);