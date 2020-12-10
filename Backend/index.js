const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();


//defining app as the main Express Handler
var app = Express();


//router imports
const authRoute = require("./routes/auth");
const settingsRoute = require("./routes/settings");


//Express setting-up
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));


//routing
app.use('/api', authRoute);
app.use('/api/settings', settingsRoute);


//Mongoose DataBase connection
mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('DATABASE CONNECTED')
}).catch((error)=> {
    console.log("ERROR OUCCURED", error);
});





//lancing the server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT} `);
});
