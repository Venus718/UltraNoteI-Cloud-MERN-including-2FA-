const User = require('../../models/user');
const Wallets = require('../../models/wallet');

module.exports = {

    async getAllUsers(req, res) {
        try {
            const users = await User.find({});
            res.status(200).json(users);

        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    },

    async addContact(req, res) {
        try {
            let userId = req.body.id;
            let contactId = req.body.contact_id;
            
            let user = await User.findOne({_id: userId});
            if (user.contacts){
                user.contacts.push(contactId);
            } else {
                user.contacts = [contactId];
            }

            const updated = await User.updateOne({_id: userId}, { 
                $set: {
                    contacts: user.contacts
                }
            });

            user = await User.findOne({ _id: userId });

            res.status(200).json({ message: 'Contact Added Successfully', user });
        }
        
        catch (error) {
            res.status(400).json({ message: 'ERROR WHILE ADDING CONTACT', error });
            console.log(error)
            res.status(500).json(error)
        }
    },

    async getContactList(req, res) {
        try {
            let userId = req.body.id;
            try{
                let user = await User.findOne({_id: userId});
                if (user.contacts){
                    const users = await User.find({_id: {$in:user.contacts}});
                    const contactList = [];
                    const wallets = await Wallets.find({walletHolder: {$in:user.contacts}});

                    for (let i = 0; i< users.length; i++){
                        const us = users[i];
                        let walletsAddresses = wallets.filter((wallet) => {
                            if (wallet.walletHolder.toString() == us._id.toString()) {
                                return true;
                            }
                            return false;
                        });

                        if (walletsAddresses) {
                            walletsAddresses = walletsAddresses.map((wallet) => wallet.address);
                        }
                        contactList.push({
                            name: us.firstName + ' ' + us.lastName,
                            id: us._id,
                            walletsAddresses: walletsAddresses,
                        });
                    };
                    res.status(200).json({ message: 'Contacts Found', data: contactList});

                    
                } else {
                    res.status(200).json({ message: 'No Contacts Found', data: [] });
                }
            }
            catch(error) {
                console.log(error)
                res.status(400).json({ message: 'ERROR WHILE ADDING CONTACT', error });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}