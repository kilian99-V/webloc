import {parseB64,file2parsed} from "./browser.js";

//alert("dd")

document.getElementById("drop").addEventListener('dragover', (e) => {
    e.preventDefault()
});

document.getElementById("drop").addEventListener("drop", async (event) => {
    //alert("trigger")
    console.log(event)
    event.preventDefault();
    let out = await file2parsed(event.dataTransfer.files[0])
    let link = document.createElement("a");
    link.href = out[0].URL;
    link.innerText = out[0].URL
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    
    /* let out = parseB64("YnBsaXN0MDDRAQJTVVJMXxApaHR0cHM6Ly9sZWdhY3kuY3J5cHRvb2wub3JnL2RlL2N0by9jYWVzYXIICw8AAAAAAAABAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAOw==")
    let link = document.createElement("a");
    link.href = out[0].URL;
    link.innerText = out[0].URL
    link.target = "_blank"
    document.body.appendChild(link)
    link.click() */
})

if ('launchQueue' in window) {
    launchQueue.setConsumer(launchParams => {
      handleFiles(launchParams.files);
    });
  } else {
    console.error('File Handling API is not supported!');
  }
  
  async function handleFiles(files) {
    for (const file of files) {
        debugger
        let out = await file2parsed(await file.getFile())
        let link = document.createElement("a");
        link.href = out[0].URL;
        link.innerText = out[0].URL
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
      const blob = await file.getFile();
      const text = await blob.text();
      console.log(`${file.name} handled, content: ${text}`);
    }
    close()
  }