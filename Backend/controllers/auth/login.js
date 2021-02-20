const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const twoFactAuth = require('../../controllers/auth/two_fact_auth');
const bcrypt = require('bcrypt');

module.exports = {

    async loginUser(req, res) {
     if(!req.body.mail || !req.body.password) {
         return res.status(400).json({message:"No empty fields allowed"});
     }
     await User.findOne({mail: req.body.mail}).then(user => {
         if (!user) {
            return res.status(400).json({message:"E-mail is wrong"});
         }
            return bcrypt.compare(req.body.password, user.password).then((result) => {
                if(!result) {
                    return res.status(400).json({message:"Password is wrong"});
                } 
                if(user.isActive === false) {
                    return res.status(400).json({message:"Account is not active yet"});
                }
                if (user.two_fact_auth === true) {
                    twoFactAuth.two_fact_auth(user).then(() => {
                        const token = jwt.sign({data: user } , process.env.TOKENCODE, {expiresIn: '72h'});
                        return res.status(200).json({message: '2FA steps', twoFA: user.two_fact_auth, token});
                    });
                } else {
                    const userData = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        mail: user.mail,
                        phone: user.phone,
                        image: user.image,
                        createdAt: user.creationDate,
                        two_fact_auth: user.two_fact_auth,
                        is_active: user.isActive,
                        contacts: user.contacts,
                        isWalletCreated: user.isWalletCreated,
                        id: user._id
                    }
                    tokenData = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.mail,
                        phone: user.phone,
                        creationDate: user.creationDate,
                        two_fact_auth: user.two_fact_auth,
                        isActive: user.isActive,
                        contacts: user.contacts,
                        _id: user._id
                    }

                    const token = jwt.sign({data: tokenData } , process.env.TOKENCODE, {expiresIn: '72h'});
                    return res.status(200).json({message: 'login successful', user: userData, token});
                }  
            })
        }).catch (err => {
            console.log(err);
        return res.status(400).json({message: 'ERROR WHILE LOGGING IN', err});
     });
    }
}
