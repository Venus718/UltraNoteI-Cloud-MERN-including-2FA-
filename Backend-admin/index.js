/* eslint consistent-return:0 import/order:0 */

const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//defining app as the main Express Handler
const app = Express();

//router imports
const apiRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const walletsRoute = require("./routes/wallets");
const dashboardRoute = require("./routes/dashboard");

//Express setting-up
app.use(cors());
app.use(BodyParser.json({ limit: "50mb" }));
app.use(BodyParser.urlencoded({ limit: "50mb", extended: true }));

//routing
app.use("/api", apiRoute);
app.use("/api/users", usersRoute);
app.use("/api/wallets", walletsRoute);
app.use("/api/dashboard", dashboardRoute);

//Mongoose DataBase connection
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((error) => {
    console.log("ERROR OUCCURED", error);
  });

//lancing the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT} `);
});
