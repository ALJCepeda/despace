import {getContract} from "./getContract";
import Web3 from "web3";

const deployed:any = {};

export async function deployContract(w3: Web3, name:string, from:string) {
  const contract = getContract(w3, name);
  const instance = await contract.send({ from: from, gas: 1500000, gasPrice: '30000000000' });
  deployed[name] = instance.options.address;
  return deployed;
}

export function getDeployed() {
  return deployed;
}