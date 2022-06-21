const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//defining app as the main Express Handler
var app = Express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3006"],
  },
});

//router imports
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const walletRoute = require("./routes/wallet");

//Express setting-up
app.use(cors());
app.use(BodyParser.json({ limit: "50mb" }));
app.use(BodyParser.urlencoded({ limit: "50mb", extended: true }));

//routing
app.use("/api", authRoute);
app.use("/api/user", userRoute);
app.use("/api/wallets", walletRoute);

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

// Socket connection

io.on("connection", (socket) => {
  try {
    const authorization = socket.handshake.headers.authorization;
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKENCODE);

    if (!token || !decodedToken?.data?._id) socket.disconnect();

    // socket.on("disconnect", (reason) => {
    //   console.log("socket is disconnected", socket.id);
    // });
  } catch (err) {
    console.log("Error::", err);
    socket.disconnect();
  }
});

//lancing the server
server.listen(process.env.RUNNING_PORT, () => {
  console.log(`Listening on port: ${process.env.PORT} `);
});
