// @ts-ignore
import backupAbiStr from '../../dist/_Backup_sol_Backup.abi';
// @ts-ignore
import backupBin from '../../dist/_Backup_sol_Backup.bin';
import Web3 from "web3";
import {AppAPI} from "@/api/App";
import {MessagesAPI} from "@/api/Messages";
import {Backup} from "@/models/Backup";

const backupAbi = JSON.parse(backupAbiStr);

export const BackupAPI = {
  async create(w3:Web3, data:Backup, from:string) {
    const contract = new w3.eth.Contract(backupAbi);

    const transaction = contract.deploy({
      data: backupBin,
      arguments: [data.app, data.messages]
    });

    return transaction.send({
      from,
      gas: 1500000,
      gasPrice: '30000000000'
    });
  },

  async recover(w3:Web3, address:string) {
    const contract = new w3.eth.Contract(backupAbi, address);
    const call = await contract.methods.get().call();
    const backup = new Backup({
      app: call.app,
      messages: call.messages
    });

    const app = await AppAPI.get(w3, backup.app);
    app.messages = await MessagesAPI.get(w3, backup.messages);

    return {
      app,
      backup
    };
  }
}