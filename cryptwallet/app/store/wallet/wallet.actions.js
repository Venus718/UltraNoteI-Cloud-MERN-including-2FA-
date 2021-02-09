import WalletTypes from "./wallet.types";


export const addWalletStart = (payload) => ({
    type: WalletTypes.ADD_WALLET_START,
    payload
});


export const addWalletSuccess = (payload) => ({
    type: WalletTypes.ADD_WALLET_SUCCESS,
    payload
});

export const updateWalletStart = (payload) => ({
    type: WalletTypes.UPDATE_WALLET_START,
    payload
});


export const updateWalletSuccess = (payload) => ({
    type: WalletTypes.UPDATE_WALLET_SUCCESS,
    payload
});

export const withdrawWalletStart = (payload) => ({
    type: WalletTypes.WITHDRAW_WALLET_START,
    payload
});


export const withdrawWalletSuccess = (payload) => ({
    type: WalletTypes.WITHDRAW_WALLET_SUCCESS,
    payload
});


export const getWalletStart = (payload) => ({
    type: WalletTypes.GET_ALL_WALLETS,
    payload
});


export const getWalletSuccess = (payload) => ({
    type: WalletTypes.GET_ALL_WALLETS_SUCCESS,
    payload
});



export const getTransactionsByWalletAddressStart = (payload) => ({
    type: WalletTypes.GET_TRANSACTIONS_BY_WALLET,
    payload
});


export const getTransactionsByWalletAddressSuccess = (payload) => ({
    type: WalletTypes.GET_TRANSACTIONS_BY_WALLET_SUCCESS,
    payload
});

export const walletReset = () => ({
    type: WalletTypes.WALLET_RESET
});

export const walletResetSuccess = () => ({
    type: WalletTypes.WALLET_RESET_SUCCESS
});


export const throwError = (payload) => ({
    type: WalletTypes.ERROR,
    payload
});