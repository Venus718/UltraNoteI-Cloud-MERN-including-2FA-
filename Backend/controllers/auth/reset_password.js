const user = require('../../models/user');
const User = require('../../models/user');
const Helpers = require('../../helpers/resetPasswordMail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports = {
    async resetPassword_snedingMail(req, res) {
        try {
            if (!req.body.mail) {
                res.status(400).json({message: 'No empty field allowed'})
            } else {
                User.findOne({mail: req.body.mail}).then(async (user) => {
                    const token = jwt.sign({data: user}, process.env.TOKENCODE, {expiresIn: '168h'});
                    const result = await Helpers.ResetPasswordMail(user, token);
                    if (result) {
                        res.status(200).json({message: 'We sent you password reset mail'});
                    } else {
                        res.status(400).json({message: 'faild to resetPassword try again later'});
                    }
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({mssage: 'ERROR OUCCURED', error})
        }
    },


    async resetPassword_decodemail(req, res) {
        try {
            if (!req.params.token) {
                res.status(400).json({message: 'No token provided'});
            } else {
                const token = req.params.token;
                    res.status(200)
                    .redirect(`${process.env.HOST}${process.env.PORT_FRONT}/newpassword/`+token);
            }
        } catch (error) {
            console.log(error);
            res.status(200).json({message: 'ERROR OUCCURED', error})
        }
    },



    async resetPassword_newPassword(req, res) {
        try {
            if (!req.body.password || !req.params.token) {
                res.status(400).json({message: 'No empty field allowed'});
            } else {
                const token = req.params.token;
                const password = req.body.password;
                const payload = jwt.verify(token, process.env.TOKENCODE);
                const id = payload.data._id;
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);
                User.updateOne({_id: id}, {
                    $set: {
                        password: passwordHash
                    }
                }).then(user => {
                    res.status(200).json({message: 'password updated successfully'});
                }).catch(error => {
                    res.status(400).json({message: 'ERROR WHILE SETTING THE NEW PASSWORD', error});
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'ERROR OCCURED'});
        }
    }
}