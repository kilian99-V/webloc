import {file2parsed} from "./browser.js";
window.__external__ = {}


if(localStorage.getItem("webloc_autoopen") === "true") {
    window.__external__.AutoOpen = true;
}else {
    window.__external__.AutoOpen = false;
}
// test
window.__external__.changeAutoOpen = (e) => {
    window.__external__.AutoOpen = e;
    localStorage.setItem("webloc_autoopen", e)
    //console.log(e);
}

window.__external__.defaultAutoOpen = () => {
    return window.__external__.AutoOpen;
}

window.__external__.changeFiles = async(e) => {
    //console.log(e);
    console.log(e);
    let links = []
    
    /* for(const file of e){
        let link = await file2parsed(file)
        console.log(links);
        links.push(link[0].URL)
    } */
    await Promise.all(e.map(async (file) => {
        let link = await file2parsed(file)
        console.log(links);
        links.push(link[0].URL)
    }))
    /* e.forEach(async file => {
    }); */
    window.__external__.links = links;
    if(window.__external__.AutoOpen) {
        window.__external__.openDialog()
    }else{
        window.__external__.openLinks();
    }
}



window.__external__.getLinks = () => {
    return window.__external__.links ? window.__external__.links : []
}

window.__external__.setOpenDialog = (e) => {
    window.__external__.openDialog = e;
}

window.__external__.openLinks = () => {
    window.__external__.links.forEach(element => {
        window.open(element)
    });
}