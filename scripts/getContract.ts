import {readFileSync} from "fs";
import Web3 from "web3";

export function getArtifacts(name:string) {
  const abiFile = readFileSync(`dist/_${name}_sol_${name}.abi`, 'utf8');
  const bin = readFileSync(`dist/_${name}_sol_${name}.bin`, 'utf8');
  const abi = JSON.parse(abiFile);

  return { abi, bin };
}

export function getContract(w3:Web3, name:string, contractArgs:any[] = []) {
  const artifacts = getArtifacts(name);

  return new w3.eth.Contract(artifacts.abi).deploy({
    data: artifacts.bin,
    arguments: contractArgs
  });
}