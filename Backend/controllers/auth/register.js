const User = require('../../models/user');
const bcrypt = require('bcrypt');
const helper = require('../../helpers/activationMail');
const jwt = require('jsonwebtoken');
const user = require('../../models/user');
const { request } = require('express');


module.exports = {
    async registerUser(req, res) {
       try {
        if (!req.body.mail && !req.body.password) {
            return res.status(400).json({message: 'No empty fields allowed'});
        }
        const mail = req.body.mail;
        const password = req.body.password;
        mail.toLowerCase();
        const emailExist = await User.findOne({mail: mail});
        if (emailExist) return res.status(400).json({message: 'Email already exist!'});
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await  bcrypt.hash(password, salt);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            mail: mail,
            password: passwordHash,
        });
        user.save().then(async (savedUser) => {
           try {
            const token = jwt.sign({data: savedUser } , process.env.TOKENCODE, {expiresIn: '168h'});
            const result =  await helper.ActivationMail(savedUser, token);
            if (result) {
                res.status(200).json({message: 'User add successfully'});
            }
           } catch (error) {
            console.log(error);
            res.status(400).json({message: 'faild while sending the activation male', error})
           }
        })
       } catch (error) {
           res.status(400).json({message: 'ERROR WHILE CREATING AN ACCOUNT', error});
       }
    },


    async activateAccount(req, res) {
        try {
            const token = req.params.token;
            if (!token) {
                res.status(400).json({message: 'No token provided'});
            } else {
                const decodedToken =  jwt.verify(token, process.env.TOKENCODE);
                console.log(decodedToken);
                await User.updateOne({_id: decodedToken.data._id}, {
                    $set: {
                        isActive: true
                    }
                }).then(()  => {
                    res.redirect(`${process.env.HOST}${process.env.PORT_FRONT}/login`);
//                    res.status(200).json({message: "account activated successfully", user});
                }).catch((error) => {
                    console.log(error);
                    res.status(400).json({message: 'ERROR OUCCURED', error});
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'ERROR OUCCURED', error});
        }
    }
}