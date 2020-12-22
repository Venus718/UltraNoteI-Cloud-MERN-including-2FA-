const XUNI = require('ultranotei-api');
const Wallets = require('../../models/wallet');
const Transactions = require('../../models/transactions');
const wallet = require('../../models/wallet');
const xuni = new XUNI(process.env.XUNI_HOST, process.env.XUNI_PORT);     

module.exports = {
    async getWalletStatus(req, res) {
        try {
            const status = await xuni.status()

            res.status(200).json(status);
        } catch (error) {
            console.log('*'.repeat(50), 'Error: ' , error)
        }
    },

    async getAllWallets(req, res) {
        const userId = req.params.id;
           Wallets.find({walletHolder: userId}).then((wallets) => {
               if (wallets) {
                   res.status(200).json(wallets);
               }
               else {
                   res.status(404);
               }
           })
           .catch((error) => {
            console.log('*'.repeat(50), 'Error: ' , error)
            res.json(status).json(error);
           })

        
    },

    async createNewWallet(req, res) {
        try {
            const resRPC = await xuni.createAddress();
            const newAddress = resRPC.address;
            const user = req.body.id;
            const name = req.body.name;

                const newWallet = {
                    walletHolder: user,
                    address: newAddress,
                    name
                };
                Wallets.create(newWallet).then((wallet) => {
                    res.status(200).json({message: 'wallet Created successfully', wallet });
                }).catch(err => {
                    res.status(400).json({message: 'ERROR WHILE CREATING A NEW WALLET', err});
                });
            } catch {
                res.status(400).json({message: 'ERROR OUCURED'});
            }
    },
    async sendTransaction(req, res) {
        try {
            const senderId = req.body.id
            const senderAddress = req.body.sender.trim();
            const recipientAddress = req.body.recipient.trim();
            const amount = +req.body.amount;
            const fee = 1;
            const anonymity = 2;
            const transactionOptions = {
                addresses: [senderAddress],
                anonymity: anonymity,
                fee: fee,
		        transfers:[
                    {
                        amount: amount,
                        address: recipientAddress
			        }
                ],
                changeAddress: senderAddress
            } 
            xuni.sendTransaction(transactionOptions).then(({transactionHash}) => {
                const newTransaction = {
                    senderID: senderId,
                    senderAdress: senderAddress,
                    recipientAdress: recipientAddress,
                    amount: amount,
                    hash: transactionHash
                }
                Transactions.create(newTransaction).then(() => {
                    res.status(200).json({message: 'New transaction sent', newTransaction});
                }).catch((err) => {
                    res.status(400).json({message: 'ERROR WHILE SAVING THE TRANSACTION IN THE DATABASE', err});
                });
            }).catch((err) => {
                console.log(err);
                res.status(400).json({message: 'ERROR WHILE SENDING THE TRANSACTION'});
            });

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
                    {recipientAdress: walletAddress},
                    {senderAdress: walletAddress}
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
                res.status(200).json({deposit, withdraw});
            })
            .catch((error) => {
                res.status(500).json({message: 'An error has been occured !'});
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
        const {address} = req.params;
        console.log(address);
        console.log('sadok'+'hama');
        const balance = await xuni.getBalance(address.trim());
        res.status(200).json({message: 'BALANCE:', balance})
       } catch (error) {
           res.json(error)
       }
    }
}