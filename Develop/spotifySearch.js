const playlistArea = document.getElementById("musicDisplay");

// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '8bd7c573696d42d599f3eec103904dcc';
const redirectUri = 'https://jsnicholas.github.io/FitMix/';
const scopes = [
    'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Make a call using the token
// $.ajax({
//     url: "https://api.spotify.com/v1/me/top/artists",
//     type: "GET",
//     beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
//     success: function (data) {
//         // Do something with the returned data
//         data.items.map(function (artist) {
//             let item = $('<li>' + artist.name + '</li>');
//             item.appendTo($('#top-artists'));
//         });
//     }
// });

// define form elements as variables
const submitBtn = document.getElementById("submitBtn");
const genreSelection = document.querySelectorAll('input[name="genre"]');
const tempoSelection = document.querySelectorAll('input[name="tempo"]');


// fetch the user options when they click the submit button
function getRecommendations(selectedGenre, selectedTempo) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + _token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${selectedGenre}&target_danceability=${selectedTempo}&limit=5`, requestOptions)
        .then(response => response.text())
        .then(result => displayResults(result))
        .catch(error => console.log('error', error));
    //

}


// spotify oEmbed frame method
let playlistObject = "";
function displayResults(result) {
    playlistObject = JSON.parse(result);
    for (i = 0; i < playlistObject.tracks.length; i++) {
        let spotifyID = playlistObject.tracks[i].id
        var songItem = `<iframe src="https://open.spotify.com/embed/track/` + spotifyID + `?utm_source=oembed" frameBorder="0" width="100%" height="100px" allow="encrypted-media"></iframe><br />`
        playlistArea.insertAdjacentHTML("beforeend", songItem);
    }
}
