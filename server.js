const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const UtenteDAO = require('./DAO/utenteDAO');
const ChatDAO = require('./DAO/chatDAO');
const MessaggioDAO = require('./DAO/messaggioDAO');
const socketIo = require('socket.io');
const http = require('http');
const Utils = require('./class/utils');

const app = express();
const port = process.env.PORT || 9000;

mongoose.connect('mongodb+srv://whatsapp_clone:clone@cluster0.g7wlp.mongodb.net/whatsapp?retryWrites=true&w=majority', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'temp');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
      //rimuovo la foto dopo 5 minuti
      setTimeout(()=>{
        try {
          fs.unlinkSync('./temp/' + file.originalname);
        } catch (error) {
          console.log(error);
        }
      }, 300 * 1000);
  }
});
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'foto');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
const upload2 = multer({storage: storage2, fileFilter: fileFilter });

app.use(cors({
  origin:['https://whatsappclone1234.herokuapp.com'],
  credentials:true
}));

app.use(session({
  secret: 'NAEMETALPRELIOBTNAVRES',
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false, // Secure is Recommeneded, However it requires an HTTPS enabled website (SSL Certificate)
      maxAge: 86400000 // 1 Days in miliseconds
  }
}));

app.use(express.static('client/build'));

// parse application/json
app.use(bodyParser.json())
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//SOCKET
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  let myUsername;

  const disconnessione = () => {
    UtenteDAO.setLastAccess(myUsername);
    UtenteDAO.setIsOnline(myUsername, false);
    UtenteDAO.allOpenChat(myUsername)
    .then(res => {
      res.forEach(el => {
        io.to(el).emit('chatOffline', {});
      });
      myUsername = null;
    });
  }

  socket.on('iamOnline', data => {
    myUsername = data;
    
    UtenteDAO.setSocketId(data, socket.id);
    UtenteDAO.setIsOnline(data, true);

    UtenteDAO.allOpenChat(data)
    .then(res => {
      res.forEach(el => {
        io.to(el).emit('chatOffline', {});
      });
    });
  });

  socket.on('searchUser', data => {
    UtenteDAO.searchUser(data.search)
    .then(res => socket.emit('userSerched', res.filter(el => el !== data.reqUser)));
  });

  socket.on('getLastAccess', data => {
    UtenteDAO.isOnline(data)
    .then(res => {
      if(res)
      {
        socket.emit('lastAccess', {user: data, lastAccess: 'online'});
      }
      else
      {
        UtenteDAO.getLastAccess(data)
        .then(res => socket.emit('lastAccess', {user: data, lastAccess: res}));
      }
    });
  });

  socket.on('sendMex', data => {
    MessaggioDAO.createMessaggio(data.chatId, data.mex, myUsername);
    UtenteDAO.isOnline(data.dest)
    .then(res => {
      if(res)
      {
        UtenteDAO.getOpenChat(data.dest)
        .then(res2 => {
          if(res2 === myUsername)
          {
            MessaggioDAO.getMex(data.chatId)
            .then(messaggi => {
              messaggi.forEach(el => MessaggioDAO.setLetto(String(el._id)));
            });

            UtenteDAO.getSocketId(data.dest)
            .then(sock => io.to(sock).emit('newMex', data.mex));

            UtenteDAO.getSocketId(data.dest)
            .then(sock => io.to(sock).emit('newMexFromAnyFriend', {}));

            setTimeout(() => {
              socket.emit('newMex', data.mex);
            }, 200);
          }
          else
          {
            UtenteDAO.getSocketId(data.dest)
            .then(sock => io.to(sock).emit('newMexFromAnyFriend', {}));
          }
        });
      }
      else
      {
        UtenteDAO.getSocketId(data.dest)
        .then(sock => io.to(sock).emit('newMexFromAnyFriend', {}));
      }
    });
  });

  socket.on('getmex', chatId => {
    MessaggioDAO.getMex(chatId)
    .then(result => socket.emit('setmex', result));
  });

  socket.on('getchat', data => {
    if(myUsername)
    {
      const arrObj = new Array();
    let numOfChat;
    let obj;

    UtenteDAO.getChatId(myUsername)
    .then(result => {
      numOfChat = result.length;
      result.forEach(el => {
        ChatDAO.getFriendName(el, myUsername)
        .then(friendName => {
          MessaggioDAO.getLastMex(el)
          .then(lastMex => {
            MessaggioDAO.getNonLetti(myUsername, el)
            .then(nonLetti => {
              if(friendName && lastMex)
              {
                obj = {};
                obj.username = friendName;
                obj.last = lastMex.testo;
                obj.is_letto = lastMex.is_letto;
                obj.non_letti = nonLetti;
                obj.data = lastMex.data_ora;

                arrObj.push(obj);

                if(arrObj.length === numOfChat)
                {
                  socket.emit('setchat', arrObj.sort((a, b) => Utils.compare(new Date(a.data), new Date(b.data))));
                }
              }
            });
          });
        });
      });
    })
    .catch(error => console.log(error));
    }
  });

  socket.on('setletto', mitt => {
    ChatDAO.chatExist([mitt, myUsername])
    .then(result => {
      MessaggioDAO.getMex(String(result))
      .then(messaggi => {
        messaggi.filter(el => el.mittente === mitt).forEach(el => MessaggioDAO.setLetto(String(el._id)));
        UtenteDAO.getSocketId(mitt)
        .then(sock => io.to(sock).emit('newMex', {}));
      });
    });
  })

  socket.on('write', data => {
    if(data.text === "")
    {
      UtenteDAO.isOnline(data.dest)
      .then(res => {
        if(res)
        {
          UtenteDAO.getOpenChat(data.dest)
          .then(res2 => {
            if(res2 === myUsername)
            {
              UtenteDAO.getSocketId(data.dest)
              .then(sock => io.to(sock).emit('scrivendo', false));
            }
          });
        }
      });
    }
    else
    {
      UtenteDAO.isOnline(data.dest)
      .then(res => {
        if(res)
        {
          UtenteDAO.getOpenChat(data.dest)
          .then(res2 => {
            if(res2 === myUsername)
            {
              UtenteDAO.getSocketId(data.dest)
              .then(sock => io.to(sock).emit('scrivendo', true));
            }
          });
        }
      });
    }
  });

  socket.on('disconnect', () => {
    disconnessione();
  });

  socket.on('disconnetti', () => {
    disconnessione();
  });
});


//ROUTE
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.post('/temp_foto', upload.single('foto'), (req, res) => {
  res.send('ok');
});

app.post('/foto', upload2.single('blob'), (req, res) => {
  res.send('ok');
});

app.get('/temp/*', (req, res) => {
  res.sendFile(req.url , { root : __dirname});
});

app.get('/foto/*', (req, res) => {
  res.sendFile(req.url , { root : __dirname});
});

app.get('/islog', (req, res) => {
  if(req.session.user)
    res.send(req.session.user);
  else
    res.send('none');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
});

app.post('/signin', (req, res) => {
  const username = req.body.user.toLowerCase();
  if(!req.session.user) {
    UtenteDAO.creaUtente(username, req.body.pass)
    .then(result => {
      if(result) {
        //cambio nome foto
        fs.rename('./foto/' + req.body.random + '.jpg', './foto/' + username + '.jpg', err => {
          console.log(err);
        });

        res.redirect('/');
      }
      else {
        res.send('username già esistente');
      }
    });
  }
  else{
    res.send('sei già loggato');
  }
});

app.post('/login', (req, res) => {
  const username = req.body.user.toLowerCase();
  if(!req.session.user) {
    UtenteDAO.isOnline(username)
    .then(ison => {
      if(ison)
      {
        res.send('sei già loggato su un altro dispositivo')
      }
      else
      {
        UtenteDAO.checkPass(username, req.body.pass)
        .then(result => {
          if(result) {
            req.session.user = username;
            res.redirect('/');
          }
          else {
            res.send('username o passwor errati');
          }
        });
      }
    });
  }
  else{
    res.send('sei già loggato');
  }
});

app.post('/create_chat', (req, res) => {
  if(req.session.user)
  {
    UtenteDAO.setOpenChat(req.session.user, req.body.users[0]);
    req.body.users.push(req.session.user);
    ChatDAO.chatExist(req.body.users).then(result => {
      if(!result)
      {
        ChatDAO.creaChat(req.body.users)
        .then(result2 => {
          if(result2)
          {
            res.send(result2._id)
          }
          else{
            res.send('none');
          }
        });
      }
      else
      {
        res.send(result);
      }
    });
  }
  else
  {
    res.send('error');
  }
});

server.listen(port);