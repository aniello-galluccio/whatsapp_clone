const Utente = require('../models/utente');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

module.exports = class UtenteDAO {
  static async creaUtente(user, pass) {
    const userCreated = await this.existUtente(user)
    .then(res => {
      if(res) {
        return null;
      }
      else
      {
        return bcrypt.hash(pass, 10)
        .then(hash => {
          return new Utente({
            _id: new mongoose.Types.ObjectId(),
            username: user,
            password: hash
          }).save()
          .then(res => res)
        });
      }
    });

    return userCreated;
  }
  
  static async existUtente(user) {
    const exist = await Utente.findOne({username: user}).exec()
    .then(result => {
      if(result !== null)
        return true;
      else
        return false;
    });
  
    return exist;
  }
  
  static async checkPass(user, pass) {
    const check = await this.existUtente(user, pass)
    .then(res => {
      if(res) {
        return Utente.findOne({username: user}).exec()
        .then(result => {
          return bcrypt.compare(pass, result.password)
          .then(res2 => res2);
        });
      }
      else{
        return res;
      }
    });

    return check;
  }

  static async searchUser(str) {
    const obj = await Utente.find({ "username" : { $regex: str, $options: 'i' }}).exec()
    .then(res => {
      const arrOfUser = new Array();
      res.forEach(el => arrOfUser.push(el.username));
      return arrOfUser;
    });
    return obj;
  }

  static setIsOnline(user, bool)
  {
    Utente.updateOne({ username: user}, { $set: { is_online: bool }}).exec();
  }

  static setLastAccess(user)
  {
    Utente.updateOne({ username: user}, { $set: { ultimo_accesso: Date.now() }}).exec();
  }

  static setChatId(user, chatId)
  {
    Utente.updateOne({ username: user }, {$push: {chat_id: chatId}}).exec();
  }

  static async getLastAccess(user)
  {
    const res = await Utente.find({username : user}).exec()
      .then(result => result[0].ultimo_accesso);

    return res;
  }

  static async isOnline(user)
  {
    const res = await Utente.find({username : user}).exec()
      .then(result => result[0].is_online);
    
      return res;
  }

  static setSocketId(user, socketId)
  {
    Utente.updateOne({ username: user}, { $set: { socket_id: socketId }}).exec();
  }

  static setOpenChat(user, chatUser)
  {
    Utente.updateOne({ username: user}, { $set: { open_chat: chatUser }}).exec();
  }

  static async isOnline(user)
  {
    const on = await Utente.findOne({username: user}).exec()
    .then(res => {
      if(res)
      {
        return res.is_online;
      }
    });

    return on;
  }

  static async getSocketId(user)
  {
    const socketId = await Utente.findOne({username: user}).exec()
    .then(res => res.socket_id);

    return socketId;
  }

  static async getOpenChat(user)
  {
    const openChat = await Utente.findOne({username: user}).exec()
    .then(res => res.open_chat);

    return openChat;
  }

  static async allOpenChat(user)
  {
    const arrSocketId = await Utente.find({open_chat: user}).exec()
    .then(res => res.map(el => el.socket_id));

    return arrSocketId;
  }

  static async getChatId(user)
  {
    const ChatId = await Utente.findOne({username: user}).exec()
    .then(res => res.chat_id);

    return ChatId;
  }
}