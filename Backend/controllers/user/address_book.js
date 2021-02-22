const User = require('../../models/user');
const Wallets = require('../../models/wallet');

module.exports = {

    async addContact(req, res) {
        try {
            let userId = req.body.id;
            let label = req.body.label;
            let address = req.body.address;
            
            let user = await User.findOne({_id: userId});
            if (user.contacts){
                user.contacts.push([label, address]);
            } else {
                user.contacts = [label, address];
            }

            await User.updateOne({_id: userId}, { 
                $set: {
                    contacts: user.contacts
                }
            });

            user = await User.findOne({ _id: userId });

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

            res.status(200).json({ message: 'Contact Added Successfully', userData });
        }
        
        catch (error) {
            res.status(400).json({ message: 'ERROR WHILE ADDING CONTACT', error });
            console.log(error)
            res.status(500).json(error)
        }
    },

    async deleteContact(req, res){
        try{
            let id = req.body.id;
            let deletedContact = req.body.deleteRow;

            let user = await User.findOne({_id: id});
            let userContacts = user.contacts;

            userContacts.splice(deletedContact, 1);

            await User.updateOne({_id: id}, {
                $set: {contacts: userContacts}
            });

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

            res.status(200).json({ message: 'Contact Deleted Successfully', userData });
            

        } catch(error){
            console.log(error);
            res.status(500).json(error)
        }
    }
}