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

const ChatRoomMessage = require('./models/chat_room_msgs');
io.on("connection", (socket) => {
  try {
    const authorization = socket.handshake.headers.authorization;
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKENCODE);

    if (!token || !decodedToken?.data?._id) {
      socket.disconnect();
      console.log("socket Disconnected:::", socket?.id);
    }
    console.log("socket connected:::", socket?.id);
    socket.on("disconnect", () => {
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
          senderUser: decodedToken?.data?._id,
          msgType: data.type,
          message: message,
          createdAt: data.time,
        });
        const savedMessage = await newMessage.save();
        let cuser = await User.findOne({ _id: decodedToken?.data?._id });
        let msg = {
          userId: decodedToken?.data?._id,
          name: (cuser.firstName + " " + cuser.lastName).trim(),
          msgType: data.type,
          message: data.message,
          time: savedMessage.createdAt,
        };
        socket.broadcast.emit('ReceiveChatRoomMessage', msg);
      }

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