/* "Listen" button action
-----------------------------------------*/
const form = document.getElementById("url_field");
form.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        getURL();
    }
});

function getURL(){
    const regex = /(\/|%3|v=|vi=)([0-9A-z-_]{11})([%#?&]|$)/;
    const rawURL = form.value;
    console.log(rawURL);
    const videoID = rawURL.split(regex)[2];
    console.log(videoID);
    const repeatURL = "https://www.youtube.com/embed/" + videoID + "?playlist=" + videoID + "&loop=1";
    console.log(repeatURL);
    const player = document.getElementById("ytplayer");
    player.src = repeatURL;
    document.getElementById("url_field").value = "";
}