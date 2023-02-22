const winston = require('winston');
const moment = require("moment")
const winstonLogger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Http({host:'seed3.ultranote.org',port:1890,path:'log'}),
  ],
});
const UltraLogger = {
    debug:function(serial,msg="",uniqueKey=""){
        winstonLogger.debug({
            serial:serial,unique_key:uniqueKey,content:msg,timestamp:moment().unix()})
    },
    error:function(serial,msg="",uniqueKey=""){
        winstonLogger.error({
            serial:serial,unique_key:uniqueKey,content:msg,timestamp:moment().unix()})
    }
}
module.exports  = UltraLogger