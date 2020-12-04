const Express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose"); 
require('dotenv').config();


//defining app as the main Express Handler
var app = Express();




//Express setting-up
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));


/*const apiRoute = require("./routes/auth");
app.use('/api', apiRoute);*/

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
