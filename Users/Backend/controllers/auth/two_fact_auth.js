const User = require('../../models/user');
const UserActivity = require('../../models/user_activity');
const user_data = require('../user/user_data');
const mailer2FA = require('../../helpers/twoFactorAuth');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');


module.exports = {
    async otp_fact_auth(user) {
        try {
            const id = user._id;
            const val = Math.floor(100000 + Math.random() * 900000);
            User.findByIdAndUpdate({_id: id}, {otp_auth_code: val}).then(() => {
                mailer2FA.twoFactorAuthMail(user, val).then(() => {
                    return 'mail sent'
                }).catch((err) => {
                    console.log(err)
                    throw err
                });
            }).catch((err) => {
                console.log(err)
                throw err
            });
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    async otpAuth(req, res){
        try {
            const ip = requestIp.getClientIp(req);
            const geo = geoip.lookup(ip) || {city: '', country: ''};
            if (!req.body.code || !req.params.token) {
                res.status(400).json({message: 'No token or code provided'});
            } else {
                const token = req.params.token;
                const code = req.body.code;
                const decodedToken = jwt.verify(token, process.env.TOKENCODE);
                const user = await User.findOne({_id: decodedToken.data._id});
                if (code === user.otp_auth_code) {
                    User.updateOne({_id: decodedToken.data._id}, {
                        $set: {
                            otp_auth_code: null
                        }
                    }).then(() => {
                        if(decodedToken.data.otp_auth == true && decodedToken.data.two_fact_auth == false){
                            const userData = user_data(user);

                            const newUserActivity = {
                                userId: user._id,
                                action: 'Login',
                                source: 'Web',
                                ip: ip,
                                location: geo.city + " " + geo.country,
                                date: Date.now(),
                            }
                        
                            UserActivity.create(newUserActivity);
                            res.status(200).json({message: 'acces garanted', user: userData, token});
                        }
                        // else if(decodedToken.otp_auth == false && decodedToken.two_fact_auth == true){
                        //     const userData = user_data(user);

                        //     const newUserActivity = {
                        //         userId: user._id,
                        //         action: 'Login',
                        //         source: 'Web',
                        //         ip: ip,
                        //         location: geo.city + " " + geo.country,
                        //         date: Date.now(),
                        //     }
                        
                        //     UserActivity.create(newUserActivity);
                        //     res.status(200).json({message: 'acces garanted', user: userData, token});
                        // }
                        else if(decodedToken.data.otp_auth == true && decodedToken.data.two_fact_auth == true){
                            const userData = user_data(user);

                            // const newUserActivity = {
                            //     userId: user._id,
                            //     action: 'Login',
                            //     source: 'Web',
                            //     ip: ip,
                            //     location: geo.city + " " + geo.country,
                            //     date: Date.now(),
                            // }
                        
                            // UserActivity.create(newUserActivity);
                            res.status(200).json({status: 'next',user: userData, token});
                        }
                        
                        
                    }).catch((err) => {
                        console.log(err)
                        res.status(400).json({message: 'acces denied'});
                    });
                } else {
                    res.status(400).json({message: 'wrong code'});
                }
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'ERROR OUCURED', error});
        }
    },

    async permmision(req, res) {
        try {
            const ip = requestIp.getClientIp(req);
            const geo = geoip.lookup(ip) || {city: '', country: ''};
            if (!req.body.code || !req.params.token) {
                res.status(400).json({message: 'No token or code provided'});
            } else {
                const token = req.params.token;
                const code = req.body.code;
                const decodedToken = jwt.verify(token, process.env.TOKENCODE);
                const user = await User.findOne({_id: decodedToken.data._id});
                if (code === user.two_fact_auth_code) {
                    User.updateOne({_id: decodedToken.data._id}, {
                       
                    }).then(() => {
                        
                        const userData = user_data(user);

                        const newUserActivity = {
                            userId: user._id,
                            action: 'Login',
                            source: 'Web',
                            ip: ip,
                            location: geo.city + " " + geo.country,
                            date: Date.now(),
                        }
                    
                        UserActivity.create(newUserActivity);
                        res.status(200).json({message: 'acces garanted', user: userData, token});
                    }).catch((err) => {
                        console.log(err)
                        res.status(400).json({message: 'acces denied'});
                    });
                } else {
                    res.status(400).json({message: 'wrong code'});
                }
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'ERROR OUCURED', error});
        }
    }
}