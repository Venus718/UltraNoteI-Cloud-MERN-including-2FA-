const XUNI = require("ultranotei-api");
const { Types } = require("mongoose");
const { ObjectId } = Types;
const Wallet = require("../../models/wallet");
const xuni = new XUNI(
  process.env.XUNI_HOST || "http://127.0.0.1",
  process.env.XUNI_PORT || "9050"
);
const UltraNote = require("../../helpers/ultranote");
const ultranote = new UltraNote(
  process.env.XUNI_HOST || "http://127.0.0.1",
  process.env.XUNI_PORT || "9050"
);
const uniqid = require("uniqid");

module.exports = {
  async walletList(req, res) {
    await Wallet.find()
      .then((wallets) => {
        if (!wallets) {
          return res.status(400).json({ message: "wallets not found" });
        }
        return res.status(200).json({ wallets });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ message: "ERROR WHILE GETTING WALLETS", err });
      });
  },
  async getTransactions(req, res) {
    const walletAddress = req.params.address;

    const opts = {
      firstBlockIndex: 203000,
      blockCount: 5000000,
      addresses: [walletAddress],
    };

    const data = await xuni.getTransactions(opts);
    const totalTransactions = [];

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      for (let j = 0; j < item.transactions.length; j++) {
        const transaction = item.transactions[j];
        var message = [];
        try {
          const transaction_message = await ultranote.getTransaction(
            transaction.transactionHash
          );
          var message_list = transaction_message.split('"message":"');
          for (let k = 0; k < message_list.length; k++) {
            var msg_list = message_list[k].split('","type"');
            if (k > 0 && msg_list.length > 0 && msg_list[0].length > 0) {
              message.push(msg_list[0]);
            }
          }
          transaction.message = message;
        } catch (ex) {
          console.log(ex);
        }

        const recipientAddress = transaction.transfers[0].address;
        var senderAddress = transaction.transfers[1].address;
        if (senderAddress == "") {
          senderAddress = uniqid();
        }

        transactionObj = {
          senderAdress: senderAddress,
          recipientAdress: recipientAddress,
          updatedAt: new Date(transaction.timestamp * 1000).toISOString(),
          amount: Math.abs(transaction.transfers[0].amount),
          note: "",
          hash: transaction.transactionHash,
        };
        totalTransactions.push(transactionObj);
      }
    }

    const transactions = totalTransactions;
    const deposit = [];
    const withdraw = [];
    if (transactions && transactions.length) {
      transactions.forEach((transaction) => {
        if (transaction.senderAdress === walletAddress)
          withdraw.push(transaction);

        if (transaction.recipientAdress === walletAddress)
          deposit.push(transaction);
      });
    }
    res.status(200).json({ deposit, withdraw });
  },
  async getWalletStatus(req, res) {
    try {
      const status = await xuni.status();
      res.status(200).json(status);
    } catch (error) {
      console.log(error);
    }
  },

  async walletsdepositscheck(req, res) {
    try {
      const senderAddress = req.body.sender;
      const recipientAddress = req.body.recipient;
      const amount = req.body.amount;
      const fee = 100000;
      const anonymity = 2;
      const transactionOptions = {
        addresses: [senderAddress],
        anonymity: anonymity,
        fee: fee,
        transfers: [
          {
            amount: amount,
            address: recipientAddress,
          },
        ],
        unlockTime: 0,
        changeAddress: senderAddress,
      };
      const Transaction = await xuni.sendTransaction(transactionOptions);
    } catch (error) {
      console.log(error);
    }
  },
};
