//MY_API = ;
/* DOM element declarations
-----------------------------------------*/
const form = document.getElementById("url_field");
/* Load YouTube IFrame API
-----------------------------------------*/
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'muJK8Rx-Yhc',
      playerVars:{
        playsinline: 1,
        controls: 1,
        modestbranding: 1
      }
    });
}

/* Utility functions for extracting YouTube ID or Playlist ID
-----------------------------------------*/

function getVideoID(url){
    const regex_vid = /(\/|%3|v=|vi=)([0-9A-z-_]{11})([%#?&]|$)/;
    let videoID = url.split(regex_vid)[2];
    return videoID;
}

function getListID(url){
    const regex_lst = /(list=)(.*?)([%#?&]|$)/gm;
    let listID = url.split(regex_lst)[2];
    return listID;
}

/* "Play" button action
-----------------------------------------*/
function logPlayerStatus(){
    state = player.getPlayerState();
    url = player.getVideoUrl();
    playlist = player.getPlaylist();
    index = player.getPlaylistIndex();
    console.log('state: ', state, '| url: ', url, '| playlist: ', playlist, '| index: ', index);
}
form.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        getURL();
    }
});

function getURL(){
    const rawURL = form.value;
    if (rawURL == null || rawURL == '' || rawURL == 'http://localhost:8080/'){return;}
    if (rawURL.includes("list")){
        const listID = getListID(rawURL);
        updatePlayerList(listID);
        return;
    }
    const videoID = getVideoID(rawURL);
    updatePlayerVideo(videoID);
}

function updatePlayerList(listID){
    console.log('cueing ', listID);
    player.destroy();
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      playerVars:{
        playsinline: 1,
      	listType: 'playlist',
        list: listID,
        modestbranding: 1,
      }
    });
}

function updatePlayerVideo(videoID){
    //const repeatURL = "https://www.youtube.com/embed/" + videoID + "?playlist=" + videoID + "&loop=1";
    //const player = document.getElementById("ytplayer");
    //player.src = repeatURL;
    //document.getElementById("url_field").value = "";
    //
    console.log("cueing video",videoID);
    player.loadVideoById({videoId: videoID});
}

/* Adding favorites
-----------------------------------------*/

function buildPage(videoID){
    const favorites = document.getElementById('favorites');
    const favs = favorites.getElementsByClassName('favorite');
    
    //
    //plays = 0;// delete once play counter implemented
    title = localStorage.getItem('VID-'+videoID);
    //
    card = document.createElement('div');
    card.classList.add('card');
    card.id = 'CAPT.PRICE-' + videoID;
    fav = document.createElement('img');
    fav.classList.add('favorite');
    fav.alt = videoID;
    fav.id = videoID;
    fav.src = thumbURL(videoID);
    fav.onclick = function(event) {
        updatePlayerVideo(this.id);
    }
    container = document.createElement('div');
    container.classList.add('container');
    //h4 = document.createElement('h4');
    //b = document.createElement('b');
    //b.textContent = title;
    //b.color = 'white';
    //h4.appendChild(b);
    //p = document.createElement('p');
    //p.textContent = plays + ' Plays';
    //p.color = 'white';
    button = document.createElement('input');
    button.type = 'button';
    button.value = 'X';
    button.id = videoID;
    button.style = 'padding: 5px 5px;';
    button.onclick = function(event){
        enemyUAVoverhead = this.id;
        document.getElementById('CAPT.PRICE-'+enemyUAVoverhead).remove();
        localStorage.removeItem('VID-'+videoID);
    }
    card.appendChild(fav);
    //card.appendChild(h4);
    //card.appendChild(p);
    card.appendChild(button);
    
    favorites.appendChild(card);
}

async function getVideoDetails(videoID) {
    //requestURL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoID + '&key=' + MY_API + '&part=snippet,contentDetails,statistics,status';
    //let response = await fetch(requestURL);
    //let data = await response.json();
    let data = 'title unavailable'; // delete after API key security issue fixed
    return data;
}

function thumbURL(videoID) {
    thumb = 'http://img.youtube.com/vi/' + videoID + '/1.jpg';
    return thumb;
}

function addCurrentToFavorites(){
    let rawURL = '';
    if (form.value != ''){
        rawURL = form.value; // pull from input field
    } else {
        // try to pull from currently playing video
        try {
            let player = document.getElementById('ytplayer');
            rawURL = player.src;
        } catch (e) { // if throws TypeError (no video in iframe) 
            console.log(e.name);
            console.log('no favorite selected');
            return;
        }
        if (rawURL == null || rawURL == '' || rawURL == 'http://localhost:8080/') { // if not a valid youtube link
            return;
        }
    }

    const videoID = getVideoID(rawURL);
    const favorites = document.getElementById('favorites');
    const favs = favorites.getElementsByClassName('favorite');
    for (i=0; i< favs.length; i++) {
        id = favs[i].id
        if (id == videoID) {
            console.log("already a favorite");
            return;
        }
    }

    console.log('API request made');
    getVideoDetails(videoID).then(data => {
        console.log('API response recieved');
        //let title = data.items[0].snippet.title;
        localStorage.setItem('VID-'+videoID,data);// replace data with title after rethinking API Key security issue.
        buildPage(videoID);
    });
}

window.addEventListener('load', () => {
    for (var i = 0; i < localStorage.length; i++){
        key = localStorage.key(i);
        if (!(key.includes('VID-'))){
            continue;
        }
        ID = key.split('VID-')[1];
        buildPage(ID);
    }
});