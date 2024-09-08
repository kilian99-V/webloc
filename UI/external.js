window.__external__ = {}

window.__external__.changeAutoOpen = (e) => {
    console.log(e);
}

window.__external__.defaultAutoOpen = () => {
    return true;
}

window.__external__.changeFiles = (e) => {
    console.log(e);
}



window.__external__.getLinks = () => {
    return ["www.google.com", "example.com"]
}

window.__external__.setOpenDialog = (e) => {
    window.__external__.openDialog = e;
}

window.__external__.openLinks = () => {
    console.log("open links")
}