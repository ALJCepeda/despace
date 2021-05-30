import Web3 from "web3";

export const AccountsAPI = {
  async get(w3:Web3) {
    return w3.eth.getAccounts().then((resp) =>
      resp.map((address) => ({
        address, wei: null, eth: null
      }))
    )
  },

  async balances(w3:Web3, addresses:string[]) {
    const fetches = addresses.map((address) => w3.eth.getBalance(address));
    return Promise.all(fetches);
  }
}