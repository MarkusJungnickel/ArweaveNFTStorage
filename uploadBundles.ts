import { bundleAndSignData, createData } from "arbundles";
import { ArweaveSigner } from "arbundles/src/signing";

let key = require("./arweave-keyfile-iZT5EdzO0xt5yuO5RgTibA4VA4OGps_rzvyk3OXWesM.json")


const dataItems = [createData("hello",key)];

const signer = new ArweaveSigner(key);

const bundle =  bundleAndSignData(dataItems, key);
