const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

//defining app as the main Express Handler
var app = Express();

process.env.DB_HOST = 'mongodb+srv://test:test1234@test.iocw1.mongodb.net/UltraNote?retryWrites=true&w=majority'
process.env.HOST = 'http://192.168.8.104'
process.env.PORT = 3600
process.env.XUNI_HOST = 'http://localhost';
process.env.XUNI_PORT = '6070';
process.env.TOKENCODE = '123';
process.env.PORT_FRONT = '3006'

//router imports
const authRoute = require("./routes/auth");
const settingsRoute = require("./routes/settings");
const walletRoute = require('./routes/wallet');

//Express setting-up
app.use(cors());
app.use(BodyParser.json({limit: '50mb'}));
app.use(BodyParser.urlencoded({limit: '50mb', extended: true}));

//routing
app.use('/api', authRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/wallets', walletRoute);

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
