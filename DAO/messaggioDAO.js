const Messaggio = require('../models/messaggio');
const mongoose = require('mongoose');
const Utils = require('../class/utils');

module.exports = class MessaggioDAO {
    static async createMessaggio(chatId, testo, mitt)
    {
        const mexCreated = await new Messaggio({
            _id: new mongoose.Types.ObjectId(),
            chat_id: Utils.removeIdQuotes(chatId),
            mittente: mitt,
            testo: testo
        }).save()
        .then(res => res);

        return mexCreated;
    }

    static async getMex(chatId)
    {
        const result = await Messaggio.find({chat_id: Utils.removeIdQuotes(chatId)}).exec()
        .then(res => res);

        return result;
    }

    static async getLastMex(chatId)
    {
        const lastMex = await this.getMex(chatId)
        .then(res => {
            if(res)
            {
                const len = res.length;
                return res[len - 1];
            }
            else
            {
                return null;
            }
        });

        return lastMex;
    }

    static async getNonLetti(user, chatId)
    {
        const nonLetti = await this.getMex(chatId)
        .then(res => res.filter(el => el.mittente !== user).filter(ele => ele.is_letto === false).length);

        return nonLetti;
    }

    static setLetto(id)
    {
        Messaggio.updateOne({ _id: mongoose.Types.ObjectId(Utils.removeIdQuotes(id))}, { $set: { is_letto: true }}).exec();
    }
}