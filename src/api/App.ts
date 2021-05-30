// @ts-ignore
import appAbiStr from '../../dist/_App_sol_App.abi';
// @ts-ignore
import appBin from '../../dist/_App_sol_App.bin';
import Web3 from "web3";
import {App} from "@/models/App";

const appAbi = JSON.parse(appAbiStr);

export const AppAPI = {
  async init(w3:Web3, name:string, from:string) {
    const contract = new w3.eth.Contract(appAbi);

    const transaction = contract.deploy({
      data: appBin ,
      arguments: [name, '1.0.0']
    });

    return transaction.send({
      from,
      gas: 1500000,
      gasPrice: '30000000000'
    });
  },

  async get(w3:Web3, address:string) {
    const appContract = new w3.eth.Contract(appAbi, address);
    const result = await appContract.methods.get().call();

    return new App({
      name: result.name,
      version: result.version
    })
  }
}