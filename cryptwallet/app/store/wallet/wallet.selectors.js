import { createSelector } from "reselect";


const walletSelector = (state) => {
  return state.get('wallets');
};

export const selectWallets = createSelector(
  [walletSelector],
  (wallets) => wallets.wallets
);

export const selectAvailableBalance = createSelector(
  [walletSelector],
  (wallets) => wallets.availableBalance
);

export const selectUnconfirmedBalance = createSelector(
  [walletSelector],
  (wallets) => wallets.unconfirmedBalance
);

export const selectTransactions = createSelector(
  [walletSelector],
  (wallets) => wallets.transactions
);