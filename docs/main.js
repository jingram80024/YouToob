//MY_API = ;
/* DOM element declarations
-----------------------------------------*/
const form = document.getElementById("url_field");

/* Utility function for extracting YouTube ID
-----------------------------------------*/

function getVideoID(url){
    const regex = /(\/|%3|v=|vi=)([0-9A-z-_]{11})([%#?&]|$)/;
    let videoID = url.split(regex)[2];
    return videoID;
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
    if (rawURL == null || rawURL == '' || rawURL == 'http://localhost:8080/'){return;}
    const videoID = getVideoID(rawURL);
    updatePlayerURL(videoID)
}

function updatePlayerURL(videoID){
    const repeatURL = "https://www.youtube.com/embed/" + videoID + "?playlist=" + videoID + "&loop=1";
    const player = document.getElementById("ytplayer");
    player.src = repeatURL;
    document.getElementById("url_field").value = "";
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
        updatePlayerURL(this.id);
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



// TO DO:

// - **BEFORE PUSHING TO SOURCE** read on how to make API key a protected variable in the GitHub pages env.
//      --> this actually wont work because no mater what the client will need the key and this is a security issue....
//      so either you need to host a server at home that gets the request from GitHub and then returns the title, or just don't.....me no dev
// - Figure out how to count # of plays and store to local storage.
// - CSS styling of the cards into adjacent grid pattern that can flex based on screen size
// - Think about how to style site. When favorites are added, the canvas with particles doesn't reach that far.
// - Determine what happens if API quota is met. Am I charged? or is request denied?
// - Maybe add functionality to send api requests for playlists, searches, etc?