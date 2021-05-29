import Web3 from "web3";
import config from '../dist/deployed.json';
import {getDeployedContract} from "./deployContract";

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const w3 = new Web3(provider)

const contractRegistry = getDeployedContract(w3, 'ContractRegistry');
const featureManager = getDeployedContract(w3, 'FeatureManager');

console.log(featureManager.methods);
/*
featureManager.methods.contracts().call({
  from: config.owner
}).then((result:any) => {
  console.log(result);
});
/*

contractRegistry.methods.all().call({
  from: config.owner
}).then((result:any) => {
  console.log(result);
});

/*
contractRegistry.methods.addContract(
  'FeatureManager',
  config.deployed.FeatureManager,
  config.owner,
  'N/A',
  'Deployed Feature Manager'
).send({
  from: config.owner,
  gas: 1500000,
  gasPrice: '30000000000'
}).then(() => {
  return contractRegistry.methods.all().call({
    from: config.owner
  })
}).then((result:any) => {
  console.log(result);
})*/