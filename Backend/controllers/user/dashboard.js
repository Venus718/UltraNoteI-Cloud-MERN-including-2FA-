const User = require('../../models/user');
const Wallets = require('../../models/wallet');
const Transactions = require('../../models/transactions');

module.exports = {
    async getDepositsAndWithdrawls(req, res) {
        try {
            let userId = req.body.id;
            let userWalletAddress = '';
            const withdrawDataByMonth = [];
            const depositDataByMonth = [];
            const withdrawDataByDay = [];
            const depositDataByDay = [];
            let monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let today = new Date();
            let d;
            let lastSixthMonth = new Date();
            lastSixthMonth.setDate(1);
            lastSixthMonth.setMonth(today.getMonth() - 5);
            let lastSeventhDay = new Date();
            lastSeventhDay.setDate(today.getDate() - 6);
            try {

                // Withdraw Transactions By Month
                let withdrawTransactions = await Transactions.find({
                    $and: [
                        { senderID: userId },
                        { createdAt: { $gt: lastSixthMonth } }]
                });

                withdrawByMonth = {}
                for (let i = 0; i < withdrawTransactions.length; i++) {
                    const withdrawTransaction = withdrawTransactions[i];
                    const m = monthNames[withdrawTransaction.createdAt.getMonth()];
                    if (m in withdrawByMonth) {
                        withdrawByMonth[m] += withdrawTransaction.amount;
                    } else {
                        withdrawByMonth[m] = withdrawTransaction.amount;
                    }
                }

                // Withdraw Transactions By Days
                let withdrawTransactionsLastSevenDays = await Transactions.find({
                    $and: [
                        { senderID: userId },
                        { createdAt: { $gt: lastSeventhDay } }]
                });

                withdrawByDay = {}
                for (let i = 0; i < withdrawTransactionsLastSevenDays.length; i++) {
                    const withdrawTransaction = withdrawTransactionsLastSevenDays[i];
                    const m = dayNames[withdrawTransaction.createdAt.getDay()];
                    if (m in withdrawByDay) {
                        withdrawByDay[m] += withdrawTransaction.amount;
                    } else {
                        withdrawByDay[m] = withdrawTransaction.amount;
                    }
                }

                // Deposit Transactions By Month
                depositByMonth = {}
                let wallets = await Wallets.find({ walletHolder: userId });
                for (let i = 0; i < wallets.length; i++) {
                    const wallet = wallets[i];
                    userWalletAddress = wallet.address;

                    let depositTransactions = await Transactions.find({
                        $and: [
                            { recipientAdress: userWalletAddress },
                            { createdAt: { $gt: lastSixthMonth } }
                        ]
                    });

                    for (let i = 0; i < depositTransactions.length; i++) {
                        const depositTransaction = depositTransactions[i];
                        const m = monthNames[depositTransaction.createdAt.getMonth()];
                        if (m in depositByMonth) {
                            depositByMonth[m] += depositTransaction.amount;
                        } else {
                            depositByMonth[m] = depositTransaction.amount;
                        }
                    }
                    
                }

                // Deposit Transactions By Days
                depositByDay = {}
                for (let i = 0; i< wallets.length; i++) {
                    const wallet = wallets[i];
                    userWalletAddress = wallet.address;

                    let depositTransactionsLastSevenDays = await Transactions.find({
                        $and: [
                            { recipientAdress: userWalletAddress },
                            { createdAt: { $gt: lastSeventhDay } }]
                    });

                    for (let i = 0; i < depositTransactionsLastSevenDays.length; i++) {
                        const depositTransaction = depositTransactionsLastSevenDays[i];
                        const m = dayNames[depositTransaction.createdAt.getDay()];
                        if (m in depositByDay) {
                            depositByDay[m] += depositTransaction.amount;
                        } else {
                            depositByDay[m] = depositTransaction.amount;
                        }
                    }
                }

            } catch (error) {
                console.log('Error: ', error)
                res.json(status).json(error);
            };

            for (let i = 5; i >= 0; i -= 1) {
                d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                withdrawDataByMonth.push({ month: monthNames[d.getMonth()], actual: withdrawByMonth[monthNames[d.getMonth()]] | 0 });
                depositDataByMonth.push({ month: monthNames[d.getMonth()], actual: depositByMonth[monthNames[d.getMonth()]] | 0 });
            }

            for (let i = 6; i >= 0; i--) {
                d = new Date
                d.setDate(today.getDate() - i);
                withdrawDataByDay.push({ x: dayNames[d.getDay()], y: withdrawByDay[dayNames[d.getDay()]] | 0 });
                depositDataByDay.push({ x: dayNames[d.getDay()], y: depositByDay[dayNames[d.getDay()]] | 0 });
            }

            res.status(200).json([withdrawDataByMonth, depositDataByMonth, withdrawDataByDay, depositDataByDay]);

        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}