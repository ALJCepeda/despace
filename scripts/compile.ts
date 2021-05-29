import Web3 from "web3";
import { readdir } from 'fs';
import {exec} from "child_process";

readdir('contracts', (err, files) => {
  if(err) throw err;

  const compiles = files.map((file) => {
    return new Promise((resolve, reject) => {
      exec(`yarn solc contracts/${file}`, (err, stdout) => {
        if(err) return reject(err);

        resolve(stdout);
      })
    })
  })

  Promise.all(compiles).then(() => {
    console.log('done');
  })
})