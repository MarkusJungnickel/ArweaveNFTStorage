import Arweave from "arweave";
import * as fs from "fs";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 100000,
});

let key = require("./arweave-keyfile-iZT5EdzO0xt5yuO5RgTibA4VA4OGps_rzvyk3OXWesM.json");

// try{
const run = async (i: number) => {
  let imageData = fs.readFileSync(`./Assets/${i}.png`);
  let transaction = await arweave.createTransaction({ data: imageData }, key);
  transaction.addTag("Content-Type", "image/png");
  await arweave.transactions.sign(transaction, key);
  console.log("Uploading Image ", i, " with tx.id: ", transaction.id);
  let uploader = await arweave.transactions.getUploader(transaction);

  while (!uploader.isComplete) {
    const response = await uploader.uploadChunk();
    console.log(
      `Finished upload Image ${i}: ${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks} files uploaded`
    );
  }
  await createJSON(transaction.id, i);

  let link = "https://arweave.net/";
  link = link.concat(transaction.id);

  fs.appendFileSync("./transactions.txt", transaction.id);
  fs.appendFileSync("./transactions.txt", "\n");
  fs.appendFileSync("./imageLinks.txt", link);
  fs.appendFileSync("./imageLinks.txt", "\n");
};

let max = 5;
for (let i = 3; i <= max; i++) {
  run(i);
}
// }
// catch(e){
//     console.log("error", e)
// }

const createJSON = async (tx: string, i: number) => {
  let link = "https://arweave.net/";
  link = link.concat(tx);
  let jsonData = fs.readFileSync(`./Assets/${i}.json`);
  let jsonObject = JSON.parse(jsonData.toString());
  jsonObject.properties.image.description = link;
  //jsonObject.external_url = link;
  //jsonObject.animation_url = link;
  let jsonStr = JSON.stringify(jsonObject);

  let transaction = await arweave.createTransaction({ data: jsonStr }, key);
  transaction.addTag("Content-Type", "application/json");
  await arweave.transactions.sign(transaction, key);
  console.log("Uploading JSON ", i, " with tx.id: ", transaction.id);
  let uploader = await arweave.transactions.getUploader(transaction);

  while (!uploader.isComplete) {
    const response = await uploader.uploadChunk();
    console.log(
      `Finished upload JSON ${i}: ${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks} files uploaded`
    );
  }

  let jsonLink = "https://arweave.net/";
  jsonLink = jsonLink.concat(transaction.id);

  fs.appendFileSync("./transactions.txt", transaction.id);
  fs.appendFileSync("./transactions.txt", "\n");

  fs.appendFileSync("./links.txt", jsonLink);
  fs.appendFileSync("./links.txt", "\n");
};
