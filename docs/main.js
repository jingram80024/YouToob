/* DOM element declarations
-----------------------------------------*/
const form = document.getElementById("url_field");
/* Load YouTube iFrame API
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
      videoId: 'TURbeWK2wwg', //sample video
      playerVars:{
        playsinline: 1,
        controls: 1,
        modestbranding: 1,
        loop: 1,
        playlist: 'TURbeWK2wwg'
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
form.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        getURL();
    }
});

function getURL(){
    const rawURL = form.value;
    if (rawURL == null || rawURL == ''){return;}
    if (rawURL.includes("list")){
        const listID = getListID(rawURL);
        updatePlayerList(listID);
        return;
    }
    const videoID = getVideoID(rawURL);
    updatePlayerVideo(videoID);
}

function updatePlayerList(listID){
    console.log('loading playlist: ', listID);
    player.destroy();
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      playerVars:{
        playsinline: 1,
      	listType: 'playlist',
        list: listID,
        modestbranding: 1,
        controls: 1,
        loop: 1
      },
      events:{
        'onReady': onPlayerReady
      }
    });
}

function updatePlayerVideo(videoID){
    console.log("loading video: ", videoID);
    player.destroy();
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoID,
        playerVars:{
            playsinline: 1,
            controls: 1,
            modestbranding: 1,
            loop: 1,
            playlist: videoID 
        },
        events:{
            'onReady': onPlayerReady
        }
    });
}
function onPlayerReady(event){
    event.target.playVideo();
}

/* Adding favorites
-----------------------------------------*/

function buildFavorites(itemID, favType){
    const favorites = document.getElementById('favorites');
    const favs = favorites.getElementsByClassName('favorite');
    
    title = localStorage.getItem(itemID);
    card = document.createElement('div');
    card.classList.add('card');
    card.id = 'CAPT.PRICE-' + itemID;
    let fav = document.createElement('img');
    fav.classList.add('favorite');
    fav.alt = itemID;
    fav.id = itemID;
    let rawID = itemID.split(favType)[1];
    if (favType == "LIST-") {
        // what image do you want for lists?
        fav.onclick = function(event) {
            updatePlayerList(rawID);
        }
    } else {
        fav.src = thumbURL(rawID);
        fav.onclick = function(event) {
            updatePlayerVideo(rawID);
        }
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
    button.id = itemID;
    button.style = 'padding: 5px 5px;';
    button.onclick = function(event){
        enemyUAVoverhead = this.id;
        document.getElementById('CAPT.PRICE-'+enemyUAVoverhead).remove();
        localStorage.removeItem(itemID);
    }
    card.appendChild(fav);
    //card.appendChild(h4);
    //card.appendChild(p);
    card.appendChild(button);
    
    favorites.appendChild(card);
}

function thumbURL(videoID) {
    thumb = 'http://img.youtube.com/vi/' + videoID + '/1.jpg';
    return thumb;
}

function addCurrentToFavorites(favType){
    let videoID = '';
    let title = '';
    let listID = '';

    try {
        videoID = player.getVideoData().video_id;
        title = player.getVideoData().title;
        listID = player.getPlaylistId();
        console.log("adding to favorites: ",videoID,title,listID);
    } catch (e) {
        console.log(e.name);
        console.log('Error: no favorite selected');
        return;
    }
    if (videoID == null || videoID == '') {
        console.log('Error: no video found');
        return;
    }
    if ((listID == null || listID == '') && favType == "LIST-"){
        console.log('Error: no playlist found');
        return;
    }

    let itemID = (favType == 'LIST-' ? "LIST-"+listID : "VID-"+videoID);

    const favorites = document.getElementById('favorites');
    const favs = favorites.getElementsByClassName('favorite');
    for (i=0; i< favs.length; i++) {
        id = favs[i].id
        if (id == itemID){
            console.log('already a favorite');
            return;
        }
    }

    localStorage.setItem(itemID,(favType == 'LIST-' ? listID : title))//adjust later to prompt user to name playlist
    buildFavorites(itemID, favType);
}

window.addEventListener('load', () => {
    for (var i = 0; i < localStorage.length; i++){
        key = localStorage.key(i);
        if (!(key.includes('VID-') || key.includes('LIST-'))){
            continue;
        }

        buildFavorites(key,(key.includes('LIST-') ? "LIST-" : "VID-"));
    }
});