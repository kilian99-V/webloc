import bplist from 'bplist-parser';
const Buffer = require('buffer/').Buffer;

/* 
(async () => {

  //const obj = await bplist.parseFile('link.webloc');

  //console.log(JSON.stringify(obj));

  //let test = Buffer.from("YnBsaXN0MDDRAQJTVVJMXxApaHR0cHM6Ly9sZWdhY3kuY3J5cHRvb2wub3JnL2RlL2N0by9jYWVzYXIICw8AAAAAAAABAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAOw==", "base64")
  let base64_string = "YnBsaXN0MDDRAQJTVVJMXxApaHR0cHM6Ly9sZWdhY3kuY3J5cHRvb2wub3JnL2RlL2N0by9jYWVzYXIICw8AAAAAAAABAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAOw=="
//const obj = await bplist.parseFile("link.webloc");
//let test = Buffer.from("YnBsaXN0MDDRAQJTVVJMXxApaHR0cHM6Ly9sZWdhY3kuY3J5cHRvb2wub3JnL2RlL2N0by9jYWVzYXIICw8AAAAAAAABAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAOw==", "base64");
//let test = Uint8Array.from(atob(base64_string), c => c.charCodeAt(0))
    let test = Buffer.from(base64_string, "base64");
    console.log(test);
    const out = bplist.parseBuffer(test);
    console.log(out);
})(); */

export function parseB64(base64_string) {
    let test = Buffer.from(base64_string, "base64");
    //console.log(test);
    const out = bplist.parseBuffer(test);
    return out
}

function file2ArrayBuffer(file, callback) {
  let reader = new FileReader();

  reader.onload = function(e) {
      let arrayBuffer = new Uint8Array(reader.result);
      console.log(arrayBuffer);
      let test = Buffer.from(arrayBuffer)
    //console.log(test);
      const out = bplist.parseBuffer(test);
      //console.log(out)
      callback(out);
  }

  reader.readAsArrayBuffer(file);
}
export function file2parsed(file) {
  return new Promise(resolve => {
    file2ArrayBuffer(file,resolve)
  });
  
}
export function dropEvent(event) {
  
}