/* "Listen" button action
-----------------------------------------*/
const form = document.getElementById("url_field");
form.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        getURL();
    }
});

function getURL(){
    let rawURL = form.value;
    //testURL = "https://www.google.com/watch?v=cbuZfY2S2UQ";
    let idIndex = rawURL.search("/watch");
    let videoID = rawURL.slice(idIndex+9);
    let repeatURL = "https://www.youtube.com/embed/" + videoID + "?playlist=" + videoID + "&loop=1";
    const player = document.getElementById("ytplayer");
    player.src = repeatURL;
    document.getElementById("url_field").value = "";
}