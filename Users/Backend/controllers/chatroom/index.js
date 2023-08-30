const jwt = require("jsonwebtoken");
const User = require('../../models/user');
const ChatRoomMessage = require('./../../models/chat_room_msgs');
const fs = require('file-system')

module.exports = {

    async get_chat_messages(req, res) {
        try {
            const authorization = req.headers["authorization"];
            const token = authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.TOKENCODE);

            if (!token || !decodedToken?.data?._id) {
                socket.disconnect();
                res.status(401).json({ message: 'Unauthorized' });
            }

            let messages = await ChatRoomMessage.find().sort({ createdAt: 'asc' });
            messages = await Promise.all(messages.map(async (data) => {
                let cuser = await User.findOne({ _id: data?.senderUser });
                let msg = {
                    userId: cuser?._id,
                    name: (cuser.firstName + " " + cuser.lastName).trim(),
                    msgType: data.msgType,
                    message: data.msgType === "text" ? data.message : fs
                        .readFileSync(process.env.DATA_DIR + data.message)
                        .toString(),
                    time: data.createdAt,
                };
                return msg
            }));
            res.status(200).json(messages);

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'ERROR OUCURED' })
        }
    }
}