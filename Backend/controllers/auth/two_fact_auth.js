const User = require('../../models/user');
const mailer2FA = require('../../helpers/twoFactorAuth');
const jwt = require('jsonwebtoken');


module.exports = {
    async two_fact_auth(user) {
        try {
            const id = user._id;
            const val = Math.floor(1000 + Math.random() * 9000);
            User.findByIdAndUpdate({_id: id}, {two_fact_auth_code: val}).then(() => {
                mailer2FA.twoFactorAuthMail(user, val).then(() => {
                    return 'mail sent'
                }).catch((err) => {
                    throw err
                });
            }).catch((err) => {
                throw err
            });
        } catch (error) {
            throw error
        }
    },

    async permmision(req, res) {
        try {
            if (!req.body.code || !req.params.token) {
                res.status(400).json({message: 'No token or code provided'});
            } else {
                const token = req.params.token;
                const code = req.body.code;
                const decodedToken = jwt.verify(token, process.env.TOKENCODE);
                const user = await User.findOne({_id: decodedToken.data._id});
                if (code === user.two_fact_auth_code) {
                    User.updateOne({_id: decodedToken.data._id}, {
                        $set: {
                            two_fact_auth_code: null
                        }
                    }).then(() => {
                        const newuser= {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            phone: user.phone,
                            two_fact_auth: user.two_fact_auth,
                            id: user._id,
                            createdAt: user.creationDate
                        }
                        res.status(200).json({message: 'acces garanted', user: newuser, token});
                    }).catch((err) => {
                        res.status(400).json({message: 'acces denied'});
                    });
                } else {
                    res.status(400).json({message: 'wrong code'});
                }
            }
        } catch (error) {
            res.status(400).json({message: 'ERROR OUCURED', error});
        }
    }
}