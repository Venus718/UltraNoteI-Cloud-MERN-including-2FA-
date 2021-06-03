const { Types } = require('mongoose');
const { ObjectId } = Types;
const Wallet = require('../../models/wallet');

module.exports = {
  async walletList(req, res) {
    // const newWallers = new Wallet({
    //   walletHolder: ObjectId(),
    //   name: 'BTC Two ',
    //   address: 'Some address',
    //   balance: 21.00008,
    // });
    // const savedDocument = await newWallers.save();
    // console.log({ savedDocument });
    await Wallet.find()
      .then(wallets => {
        if (!wallets) {
          return res.status(400).json({ message: 'wallets not found' });
        }
        return res.status(200).json({ wallets });
      })
      .catch(err => {
        console.log(err);
        return res
          .status(400)
          .json({ message: 'ERROR WHILE GETTING WALLETS', err });
      });
  },
};
