const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const twoFactAuth = require('../../controllers/auth/two_fact_auth');
const bcrypt = require('bcrypt');

module.exports = {

    async loginUser(req, res) {
        console.log(req.body);
     if(!req.body.mail || !req.body.password) {
         console.log(req.body)
         return res.status(400).json({message:"No empty fields allowed"});
     }
     await User.findOne({mail: req.body.mail}).then(user => {
         if (!user) {
            return res.status(404).json({message:"E-mail is wrong"});
         }
            return bcrypt.compare(req.body.password, user.password).then((result) => {
                if(!result) {
                    return res.status(400).json({message:"Password is wrong"});
                } 
                if(user.isActive === false) {
                    return res.status(400).json({message:"Account is not active yet"});
                }
                if (user.two_fact_auth === true) {
                    twoFactAuth(user.username, user.mail).then(() => {
                        const token = jwt.sign({data: user } , process.env.TOKENCODE, {expiresIn: '72h'});
                        return res.status(200).json({message: 'login successful', user, token});
                    });
                } else {
                    const userData = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        createdAt: user.creationDate
                    }
                    const token = jwt.sign({data: user } , process.env.TOKENCODE, {expiresIn: '72h'});
                    return res.status(200).json({message: 'login successful', user: userData, token});
                }  
            })
        }).catch (err => {
            console.log(err);
        return res.status(400).json({message: 'ERROR WHILE LOGGING IN', err});
     });
    }
}
