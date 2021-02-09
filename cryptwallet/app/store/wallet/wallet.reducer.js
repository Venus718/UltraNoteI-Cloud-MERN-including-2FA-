const { default: WalletTypes } = require("./wallet.types");

const INITIAL_STATE = {
    wallets: [],
    availableBalance: 0,
    selectedWallet: {},
    transactions: {deposit: [], withdraw: []},
    error: null
};


const walletReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case WalletTypes.GET_ALL_WALLETS_SUCCESS:
            const fetchedWallets = action.payload;
            let availableBalance = 0;
            if (fetchedWallets && fetchedWallets.length) {
                fetchedWallets.forEach(wallet => {
                availableBalance += wallet.balance;
            });
            }
            return {
                ...state,
                availableBalance,
                wallets: fetchedWallets
            };
        case WalletTypes.GET_TRANSACTIONS_BY_WALLET_SUCCESS:
            return {
                ...state,
                transactions: action.payload
            };
        case WalletTypes.ADD_WALLET_SUCCESS:
            const walletsAfterAdd = [...state.wallets];
            walletsAfterAdd.push(action.payload);
            return {
                ...state,
                wallets: walletsAfterAdd
            };
        case WalletTypes.UPDATE_WALLET_SUCCESS:
            const walletsAfterUpdate = [...state.wallets];
            for (let i=0; i< walletsAfterUpdate.length; i++) {
                const wallet = walletsAfterUpdate[i];
                if (wallet._id == action.payload[0]._id) {
                    walletsAfterUpdate[i] = action.payload[0];
                }
            }

            return {
                ...state,
                wallets: walletsAfterUpdate
            };
        case WalletTypes.WALLET_RESET_SUCCESS:
            return { ...INITIAL_STATE};
        case WalletTypes.ERROR:
        return {
            ...state,
            error: action.payload
        };
        default: {
            return state;
        }
    }
}

export default walletReducer;
