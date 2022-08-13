import Arweave from 'arweave';
import * as fs from 'fs';
const events = require('events');
const readline = require('readline');


const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000, 
});
//https://github.com/Bundlr-Network/arbundles
let missing = 0;
let count = 0;
let complete = false;
const readFile = async () => {
    try{
    const rl = readline.createInterface({
      input: fs.createReadStream('./transactions.txt'),
      crlfDelay: Infinity
    });
    
    
    rl.on('line', async (line: string) => {
        arweave.transactions.getStatus(line).then(res => {
            console.log(`Transaction: ${line}`)
            if (res.status == 200 && res.confirmed != null){
                //console.log("File", count,": Upload Confirmed", `with ${res.confirmed.number_of_confirmations} confirmations`)
            }
            else {
                console.log("File", count,": Upload Pending")
                console.log(res)
                missing +=1;
                console.log(`Missing ${missing}`)
            }
            count+=1;
        });
    });

    await events.once(rl, 'close');
    complete = true
    
    }
    catch(e){
        console.log(e)
        readFile()
    }
   

};
    readFile()


