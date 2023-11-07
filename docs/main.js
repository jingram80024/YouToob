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

function populateFavorites(itemID, favType){
    console.log(itemID);
    const favorites_div = document.getElementById('favorites');
    const title = localStorage.getItem(itemID).slice(0,50) + "...";
    const maxColumns = 4;
    let card_prereqs = Boolean(false);
    let rawID = itemID.split(favType)[1];
    let index = -1;

    while(!card_prereqs) {
        // check for containers
        const containers = document.getElementsByClassName('container');
        if (containers.length == 0) {
            const container = document.createElement('div');
            container.classList.add('container');
            favorites_div.appendChild(container);
            continue;
        }
    
        // check for available card slots in each container until one is found or finish looking
        for (let i = 0; i < containers.length; i++) {
            index = i;
            const cards = containers[i].children;
            if (cards.length < 4) {
                card_prereqs = Boolean(true);
                break;
            }
        }
        
        if (!card_prereqs) {
            // we need a new container
            const container = document.createElement('div');
            container.classList.add('container');
            favorites_div.appendChild(container);
            continue;
        }
    }

    const containers = document.getElementsByClassName('container');
    const free_container = containers[index];

    /* card template
    <div class="card">
        <h3 class="title">Card 1</h3>
        <div class="bar">
            <div class="emptybar"></div>
            <div class="filledbar"></div>
        </div>
        <div class="circle">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle class="stroke" cx="60" cy="60" r="50"/>
            </svg>
        </div>
    </div>
    */

    const card = document.createElement('div');
    card.classList.add('card');
    card.id = itemID;

    const title_h = document.createElement('h3');
    title_h.textContent = title;
    title_h.classList.add('title');

    const bar = document.createElement('div');
    bar.classList.add('bar');
    const emptybar = document.createElement('div');
    emptybar.classList.add('emptybar');
    const filledbar = document.createElement('div');
    filledbar.classList.add('filledbar');
    /*const circle_div = document.createElement('div');
    circle_div.classList.add('circle');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.version = "1.1";
    const circle = document.createElement('circle');
    circle.classList.add('stroke');
    circle.cx = '60';
    circle.cy = '60';
    circle.r = '50';*/
    const thumbnail = document.createElement('img');
    thumbnail.id = itemID;
    thumbnail.alt = itemID;
    thumbnail.src = thumbURL(rawID);
    if (favType == "LIST-") {
        // what image do you want for lists?
        thumbnail.onclick = function(event) {
            updatePlayerList(rawID);
        }
    } else {
        thumbnail.onclick = function(event) {
            updatePlayerVideo(rawID);
        }
    }
    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'X';
    button.id = itemID;
    button.style = 'padding: 5px 5px; position: absolute; right; 0px;';
    button.onclick = function(event){
        console.log(this.id + " removed from favorites");
        const cardClass = document.getElementsByClassName('card');
        for (let i = 0; i < cardClass.length; i++) {
            if (cardClass[i].id == this.id) {
                cardClass[i].remove();
                localStorage.removeItem(this.id);
            }
        }
    }
    
    bar.appendChild(emptybar);
    bar.appendChild(filledbar);

    /*svg.appendChild(circle);
    circle_div.appendChild(svg);*/

    card.appendChild(title_h);
    card.appendChild(bar);
    //card.appendChild(circle_div);
    card.appendChild(thumbnail);
    card.appendChild(button);

    free_container.appendChild(card);    
}


/*function buildFavorites(itemID, favType){
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
}*/

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

    if (localStorage.getItem(itemID) != null) {
        console.log("already a favorite.");
        return;
    }

    localStorage.setItem(itemID,(favType == 'LIST-' ? listID : title))//adjust later to prompt user to name playlist
    //buildFavorites(itemID, favType);
    populateFavorites(itemID, favType);
}

window.addEventListener('load', () => {
    for (var i = 0; i < localStorage.length; i++){
        key = localStorage.key(i);
        if (!(key.includes('VID-') || key.includes('LIST-'))){
            continue;
        }

        //buildFavorites(key,(key.includes('LIST-') ? "LIST-" : "VID-"));
        populateFavorites(key,(key.includes('LIST-') ? "LIST-" : "VID-"));
    }
});