const Chat = require('../models/chat');
const UtenteDAO = require('../DAO/utenteDAO');
const mongoose = require('mongoose');
const Utils = require('../class/utils');

module.exports = class ChatDAO {
    static async creaChat(arrOfUser)
    {
        if(arrOfUser[0] !== 'none')
        {
            const chatCreated = await new Chat({
                _id: new mongoose.Types.ObjectId(),
                utenti: arrOfUser
            }).save()
            .then(res => {
                arrOfUser.forEach(el => {
                    UtenteDAO.setChatId(el, res._id);
                });
                return res;
            });

            return chatCreated;
        }
    }

    static async chatExist(arrOfUser) {
        const exist = await Chat.find().exec()
        .then(res => {
            const len = res.length;

            for(let i=0; i<len; i++)
            {
                if(Utils.compareArr(res[i].utenti, arrOfUser))
                {
                    return res[i]._id;
                }
            }
            return null;
        });
        return exist;
    }

    static async getFriendName(chatId, myName)
    {
        const friendName = await Chat.findOne({_id : mongoose.Types.ObjectId(chatId)}).exec()
        .then(res => res.utenti.filter(el => el !== myName)[0]);

        return friendName;
    }

}