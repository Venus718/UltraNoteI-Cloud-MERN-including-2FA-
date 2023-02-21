const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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
  path:"/api/socket"
});

//router imports
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const walletRoute = require("./routes/wallet");

//Express setting-up
app.use(cors());
app.use(BodyParser.json({ limit: "50mb" }));
app.use(BodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(function (req, res, next) {
  req.io = io;
  next();
});
app.use(function(req,res,next){
  req.logSerial = 'UltraNote-' + moment().format('YYYMMDD-hhmmss') + '-' +Math.floor(
    Math.random() * (Math.pow(10, 5) - Math.pow(10, 4) - 1) + Math.pow(10, 4)
  )
  next()
})

//routing
app.use("/api", authRoute);
app.use("/api/user", userRoute);
app.use("/api/wallets", walletRoute);

// Socket connection

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
});
