const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const uniqid = require('uniqid');
const fs = require('file-system')
const User = require('./models/user')
const moment = require("moment")
require("dotenv").config();

//defining app as the main Express Handler
var app = Express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: "/api/socket"
});

//logger 
const UltraLogger = require("./helpers/logger");

//router imports
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const walletRoute = require("./routes/wallet");


// const errorHandler = 

//Express setting-up
app.use(cors());
app.use(BodyParser.json({ limit: "50mb" }));
app.use(BodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(function (req, res, next) {
  req.io = io;
  next();
});

//Generate a unique stream number to record the visit
app.use(function (req, res, next) {
  req.logSerial = 'UltraNote-' + moment().format('YYYMMDD-hhmmss') + '-' + Math.floor(
    Math.random() * (Math.pow(10, 5) - Math.pow(10, 4) - 1) + Math.pow(10, 4)
  )
  next()
})

//routing
app.use("/api", authRoute);
app.use("/api/user", userRoute);
app.use("/api/wallets", walletRoute);


app.use((err, req, res, next) => {
  // logic
  console.log('error handle')
  console.log(err)
  UltraLogger.error(req.logSerial, err, '')
  next()
})
// app.use(function(error, req, res, next) {
//   // Error handling middleware functionality
//   console.log('error handle')
//   UltraLogger.error(req.logSerial,error,'')
//   next()
// })
// Socket connection
const connectedUsers = {};
const ChatRoomMessage = require('./models/chat_room_msgs');
io.on("connection", async (socket) => {
  try {
    const authorization = socket.handshake.headers.authorization;
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKENCODE);

    if (!token || !decodedToken?.data?._id) {
      socket.disconnect();
      console.log("socket Disconnected:::", socket?.id);
    }

    let newUser = await User.findOne({ _id: decodedToken?.data?._id });
    let msgUser = {
      userId: decodedToken?.data?._id,
      name: (newUser.firstName + " " + newUser.lastName).trim(),
      picture: newUser.image ? fs
        .readFileSync(process.env.DATA_DIR + newUser.image + ".png")
        .toString() : "https://via.placeholder.com/50",
      IsMuted: newUser.IsMuted || false,
    };
    socket.broadcast.emit('ReceiveOnlineUser', msgUser);

    let userId = decodedToken?.data?._id;
    if (!connectedUsers[userId]) {
      connectedUsers[userId] = { sockets: [socket.id] };
    } else {
      connectedUsers[userId].sockets.push(socket.id);
    }
    console.log("socket connected:::", socket?.id);
    socket.on("disconnect", () => {
      socket.broadcast.emit('ReceiveRemoveUser', decodedToken?.data?._id);
      for (const item in connectedUsers) {
        const user = connectedUsers[item];
        const index = user.sockets.indexOf(socket.id);
        if (index !== -1) {
          user.sockets.splice(index, 1);
          if (user.sockets.length === 0) {

            delete connectedUsers[item];
          }
          break;
        }
      }
      console.log("user disconnected", socket?.id);
    });

    socket.on("SendChatRoomMessage", async (data) => {
      data = JSON.parse(data);
      if (data != null) {

        let message;
        if (data.type == "image") {
          message = "chat_" + uniqid() + '.png';
          if (data.message != undefined && data.message.length > 0) {
            // data.message = 'data:image/png;base64,' + data.message;
            fs.writeFile(process.env.DATA_DIR + message, data.message)
          }
        }
        else {
          message = data.message;
        }
        const newMessage = new ChatRoomMessage({
          messageId: data.msgId,
          senderUser: decodedToken?.data?._id,
          msgType: data.type,
          message: message,
          createdAt: data.time,
        });
        const savedMessage = await newMessage.save();
        let cuser = await User.findOne({ _id: decodedToken?.data?._id });
        let msg = {
          msgId: data.msgId,
          userId: decodedToken?.data?._id,
          name: (cuser.firstName + " " + cuser.lastName).trim(),
          msgType: data.type,
          message: data.message,
          picture: cuser.image ? fs
            .readFileSync(process.env.DATA_DIR + cuser.image + ".png")
            .toString() : "https://via.placeholder.com/50",
          time: savedMessage.createdAt,
          isEdited: savedMessage.isEdited
        };
        socket.broadcast.emit('ReceiveChatRoomMessage', msg);
      }

    });

    socket.on("GetAllUser", async () => {
      for (const item in connectedUsers) {
        if (item !== decodedToken?.data?._id) {
          console.log(" user ", decodedToken.data._id)
          let cuser = await User.findOne({ _id: item });
          let user = {
            userId: item,
            name: (cuser.firstName + " " + cuser.lastName).trim(),
            picture: cuser.image ? fs
              .readFileSync(process.env.DATA_DIR + cuser.image + ".png")
              .toString() : "https://via.placeholder.com/50",
            IsMuted: cuser.IsMuted || false,
          };
          socket.emit('ReceiveOnlineUser', user, true);
        }
      }
    });

    socket.on("ChangeMuteStatus", async (data) => {
      let mute = data.muteStatus === 'mute' ? true : false;
      console.log("data ", data)

      await User.findOneAndUpdate({ _id: data.userId }, { IsMuted: mute });
      let connectionIds = connectedUsers[data.userId]?.sockets;
      if (connectionIds != null) {
        connectionIds.forEach(id => {
          socket.to(id).emit("ReceiveMuteStatus", { ismute: mute })
        });
      }
    });

    socket.on("DeleteMessage", async (msgId) => {
      console.log("deletemsg ", msgId)

      await ChatRoomMessage.findOneAndUpdate({ messageId: msgId }, { isDeleted: true });
      socket.broadcast.emit('ReceiveDeleteMessage', msgId);
    });

    socket.on("UpdateMessage", async (newmsg) => {
      console.log("update ", newmsg)

      await ChatRoomMessage.findOneAndUpdate({ messageId: newmsg.msgId }, { message: newmsg.msg, isEdited: true });
      socket.broadcast.emit('ReceiveUpdateMessage', newmsg);
    });

  } catch (err) {
    console.log("Error::", err);
    socket.disconnect();
  }
});




//Mongoose DataBase connection
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((error) => {
    console.log("ERROR OUCCURED", error);
  });



//lancing the server
server.listen(process.env.RUNNING_PORT, () => {
  console.log(`Listening on port: ${process.env.PORT} `);
})