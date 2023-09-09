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
            let messages = await ChatRoomMessage.find({ isDeleted: false }).sort({ createdAt: 'asc' });
            messages = await Promise.all(messages.map(async (data) => {
                let cuser = await User.findOne({ _id: data?.senderUser });
                let msg = {
                    msgId: data.messageId,
                    userId: cuser?._id,
                    name: (cuser.firstName + " " + cuser.lastName).trim(),
                    msgType: data.msgType,
                    message: data.msgType === "text" ? data.message : fs
                        .readFileSync(process.env.DATA_DIR + data.message)
                        .toString(),
                    picture: cuser.image ? fs
                        .readFileSync(process.env.DATA_DIR + cuser.image + ".png")
                        .toString() : "https://via.placeholder.com/50",
                    time: data.createdAt,
                    isEdited: data.isEdited
                };
                return msg
            }));
            let LoginUser = await User.findOne({ _id: decodedToken?.data?._id });
            console.log(LoginUser)
            let response = {
                IsAdmin: LoginUser.IsAdmin ? LoginUser.IsAdmin : false,
                IsMuted: LoginUser.IsMuted ? LoginUser.IsMuted : false,
                messages: messages
            };
            res.status(200).json(response);

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'ERROR OUCURED' })
        }
    }
}