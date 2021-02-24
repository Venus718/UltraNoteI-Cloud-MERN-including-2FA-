const XUNI = require('ultranotei-api');
const Wallets = require('../../models/wallet');
const Transactions = require('../../models/transactions');
const Wallet = require('../../models/wallet');
const { compareSync } = require('bcrypt');
const User = require('../../models/user');
const UserActivity = require('../../models/user_activity');
const { baseModelName } = require('../../models/user');
const xuni = new XUNI(process.env.XUNI_HOST, process.env.XUNI_PORT);
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const fetch = require('node-fetch');

module.exports = {
    async getWalletStatus(req, res) {
        try {
            const status = await xuni.status()

            res.status(200).json(status);
        } catch (error) {
            console.log('*'.repeat(50), 'Error: ', error)
        }
    },

    async getAllWallets(req, res) {
        const userId = req.body.id;
        let unconfirmedBalance = 0;
        let availableBalance = 0;
        let usdAvailabeBalance = 0;
        let usdUnconfirmedBalance = 0;
        try {
            const wallets = await Wallets.find({ walletHolder: userId });
            for (let i = 0; i < wallets.length; i++) {
                const wallet = wallets[i];
                let balance = 0;
                try {
                    balance = await xuni.getBalance(wallet.address.trim());
                } catch (ex) {
                    console.log(ex);
                }

                try {
                    const unconfirmedTransactionHashe = await xuni.getUnconfirmedTransactionHashes([wallet.address.trim()]);
                    if (unconfirmedTransactionHashe.transactionHashes.length > 0)  {
                        const transaction = await Transactions.findOne({ hash: unconfirmedTransactionHashe.transactionHashes.toString()});
                        unconfirmedBalance = transaction.amount / 1000000;
                    }
                } catch (ex) {
                    console.log(ex);
                }


                await Wallets.update({ _id: wallet._id },
                {
                    $set: {
                        balance: balance.availableBalance / 1000000
                    }
                });
                availableBalance = balance.availableBalance / 1000000
            };
        } catch (ex) {
            console.log(ex);
        }

        const response = await fetch('https://localcryptos.club/api/coin/xuni');
        const data = await response.json();
        usdAvailabeBalance = availableBalance / data.data[0].XUNI.price.USD;
        usdUnconfirmedBalance = unconfirmedBalance / data.data[0].XUNI.price.USD;

        try{
            const wallets = await Wallets.find({ walletHolder: userId })
            const newWallets = [];
            for (let i = 0; i < wallets.length; i++) {
                const wallet = wallets[i];
                let keys;
                try {
                   keys = await xuni.getSpendKeys(wallet.address.trim());

                } catch (ex) {
                    console.log(ex);
                    keys = {}
                }
                wallet.spendKey = keys['privateSpendKey'];
                wallet.viewKey = keys['publicSpendKey'];

                newWallet = {
                    address: wallet.address,
                    balance: wallet.balance,
                    createdAt: wallet.createdAt,
                    name: wallet.name,
                    updatedAt: wallet.updatedAt,
                    walletHolder: wallet.walletHolder,
                    _id: wallet._id,
                    id: wallet._id,
                    spendKey: keys['privateSpendKey'],
                    viewKey: keys['publicSpendKey'],
                }
                newWallets.push(newWallet);
            }

            if (wallets) {
                res.status(200).json([newWallets, unconfirmedBalance, usdAvailabeBalance, usdUnconfirmedBalance]);

            }
            else {
                res.status(404);
            }

        } catch (error) {
            console.log('*'.repeat(50), 'Error: ', error)
            res.status(500).json(error);
        }

    },

    async createNewWallet(req, res) {
        try {
            const resRPC = await xuni.createAddress();
            const newAddress = resRPC.address;
            const user_id = req.body.id;
            const name = req.body.name;
            const ip = requestIp.getClientIp(req);
            const geo = geoip.lookup(ip) || {city: '', country: ''};

            const newWallet = {
                walletHolder: user_id,
                address: newAddress,
                name
            };
            try {
                let wallet = await Wallets.create(newWallet)

                await User.updateOne({ _id: user_id }, {
                    $set: {
                        isWalletCreated: true
                    }
                });

                let user = await User.findOne({ _id: user_id });

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

                const newUserActivity = {
                    userId: user_id,
                    action: 'Create Wallet',
                    source: 'Web',
                    ip: ip,
                    location: geo.city + " " + geo.country,
                    date: Date.now(),
                }
            
                await UserActivity.create(newUserActivity);

                res.status(200).json({ message: 'wallet Created successfully', data: [wallet, userData] });
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'ERROR WHILE CREATING A NEW WALLET', err });
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'ERROR OUCURED' });
        }
    },
    async UpdateWallet(req, res) {
        try {
            const resRPC = await xuni.createAddress();
            const newAddress = resRPC.address;
            const id = req.body.id;
            const userId = req.body.user_id;
            const ip = requestIp.getClientIp(req);
            const geo = geoip.lookup(ip) || {city: '', country: ''};

            const updateWallet = {
                address: newAddress,
                updatedAt: Date.now(),
            };
            Wallet.updateOne({ _id: id }, { $set: updateWallet })
                .then(async (wallet) => {
                    wallet = await Wallets.find({ _id: id });
                    res.status(200).json({ message: 'wallet Updated successfully', wallet });
                }).catch(err => {
                    console.log(err);
                    res.status(400).json({ message: 'ERROR WHILE GENERATING A NEW ADDRESS', err });
                });

            const newUserActivity = {
                userId: userId,
                action: 'Generate New Address',
                source: 'Web',
                ip: ip,
                location: geo.city + " " + geo.country,
                date: Date.now(),
            }

            await UserActivity.create(newUserActivity);
        } catch (ex) {
            console.log(ex);
            res.status(400).json({ message: 'ERROR OUCURED' });
        }
    },
    async sendTransaction(req, res) {
        try {
            const senderId = req.body.id
            const senderAddress = req.body.sender.trim();
            const recipientAddress = req.body.recipient.trim();
            const note = req.body.note.trim();
            const amount = +req.body.amount;
            const fee = 1;
            const anonymity = 2;
            const ip = requestIp.getClientIp(req);
            const geo = geoip.lookup(ip) || {city: '', country: ''};

            const transactionOptions = {
                addresses: [senderAddress],
                anonymity: anonymity,
                fee: fee,
                transfers: [
                    {
                        amount: amount,
                        address: recipientAddress
                    }
                ],
                unlockTime: 0,
                changeAddress: senderAddress
            }
            xuni.sendTransaction(transactionOptions).then(({ transactionHash }) => {
                const newTransaction = {
                    senderID: senderId,
                    senderAdress: senderAddress,
                    recipientAdress: recipientAddress,
                    amount: amount,
                    note: note,
                    hash: transactionHash
                }
                Transactions.create(newTransaction).then(() => {
                    res.status(200).json({ message: 'New transaction sent', newTransaction });
                }).catch((err) => {
                    res.status(400).json({ message: 'ERROR WHILE SAVING THE TRANSACTION IN THE DATABASE', err });
                });
            }).catch((err) => {
                console.log(err);
                res.status(400).json({ message: 'ERROR WHILE SENDING THE TRANSACTION' });
            });

            const newUserActivity = {
                userId: senderId,
                action: 'Withdraw Transaction',
                source: 'Web',
                ip: ip,
                location: geo.city + " " + geo.country,
                date: Date.now(),
            }

            await UserActivity.create(newUserActivity);

        } catch (error) {
            res.status(500).json(error)
        }
    },
    async getSpendKeys(req, res) {
        try {
            const { address } = req.params;

            const spendKeys = await xuni.getSpendKeys(address);

            res.status(200).json(spendKeys);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async getTransactions(req, res) {
        // try {

        const walletAddress = req.params.address;
        Transactions.find({
            $or: [
                { recipientAdress: walletAddress },
                { senderAdress: walletAddress }
            ]
        })
            .then((transactions) => {
                const deposit = [];
                const withdraw = [];
                if (transactions && transactions.length) {
                    transactions.forEach((transaction) => {
                        if (transaction.senderAdress === walletAddress) withdraw.push(transaction);
                        if (transaction.recipientAdress === walletAddress) deposit.push(transaction);
                    });
                }
                res.status(200).json({ deposit, withdraw });
            })
            .catch((error) => {
                res.status(500).json({ message: 'An error has been occured !' });
            })

        //     const { blockCount } = await xuni.status()

        //     const fecthOptions = {
        //         firstBlockIndex: 0,
        //         blockCount
        //     }
        //     const fetchedTransactions = await xuni.getTransactions(fecthOptions);
        //     res.status(200).json(fetchedTransactions);
        // } catch (error) {
        //     res.status(500).json(error)
        // }
    },
    async getBalance(req, res) {
        try {
            const { address } = req.params;
            const balance = await xuni.getBalance(address.trim());
            res.status(200).json({ message: 'BALANCE:', balance });
        } catch (error) {
            res.json(error)
        }
    }
}