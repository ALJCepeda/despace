// @ts-ignore
import messageAbiStr from '../../dist/_Messages_sol_Messages.abi';
// @ts-ignore
import messageBin from '../../dist/_Messages_sol_Messages.bin';
import Web3 from "web3";
import {Message} from "@/models/Message";

const messageAbi = JSON.parse(messageAbiStr);

export const MessagesAPI = {
  async init(w3:Web3, from:string) {
    const contract = new w3.eth.Contract(messageAbi);

    return contract.deploy({
      data: messageBin
    }).send({
      from,
      gas: 1500000,
      gasPrice: '30000000000'
    });
  },

  async create(w3:Web3, message:Message, to:string, from:string) {
    const contract = new w3.eth.Contract(messageAbi, to);
    return contract.methods['addMessage'](message.title, message.body)
      .send({
        from,
        gas: 1500000,
        gasPrice: '30000000000'
      });
  },

  async get(w3:Web3, address:string) {
    const contract = new w3.eth.Contract(messageAbi, address);
    const result = await contract.methods.all().call();

    return result.map((entry:any) => new Message({
      title: entry.title,
      body: entry.body
    }));
  }
}