import Web3 from "web3";
import { writeFileSync } from 'fs';
import {deployContract, getDeployed} from "./deployContract";

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const w3 = new Web3(provider)

w3.eth.getAccounts().then(async (accounts) => {
  const owner = accounts[0];

  await deployContract(w3, 'App', owner);
  await deployContract(w3, 'MessageFeature', owner);
  await deployContract(w3, 'Message', owner);

  const deployed = getDeployed();
  writeFileSync('dist/deployed.json', JSON.stringify({
    owner, deployed
  }, null, 1))
});