const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    async update_profile(req, res) {
        try {
            const token = req.params.token;
            const image = req.body.image;
            const first_name = req.body.firstName;
            const last_name = req.body.lastName;
            const email = req.body.email;
            const payload = jwt.verify(token, process.env.TOKENCODE);
            const id = payload.data._id;
            User.updateOne({ _id: id }, {
                $set: {
                    image: image,
                    firstName: first_name,
                    lastName: last_name,
                    mail: email
                }
            }).then( async (user) => {
                user = await User.findOne({ _id: id });

                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mail: user.mail,
                    phone: user.phone,
                    image: user.image,
                    createdAt: user.creationDate,
                    two_fact_auth: user.two_fact_auth,
                    isActive: user.isActive,
                    contacts: user.contacts,
                    isWalletCreated: user.isWalletCreated,
                    id: user._id
                }
                res.status(200).json({ message: 'Profile Updated Successfully', userData });
            }).catch(error => {
                res.status(400).json({ message: 'ERROR WHILE UPDATING PROFILE', error });
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: 'ERROR OCCURED' });
        }
    }
}
