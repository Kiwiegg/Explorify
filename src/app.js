const params = new URLSearchParams(window.location.search);
const myStorage = window.localStorage;

const apiURI = "http://localhost:3000/api/";

window.addEventListener('load', () => {
    if (!params.has('access_token')) {
        // console.log ("access_token: " + myStorage.getItem('access_token'));
        return;
    }
    var access_token =  params.get('access_token');
    var refresh_token = params.get('refresh_token');
    myStorage.setItem("access_token", access_token);
    myStorage.setItem("refresh_token", refresh_token);
    // console.log("access token: " + access_token);
    window.location.href = '/explore';    
});

const button = document.getElementById('btn__getTracks');

button.addEventListener('click', () => {
    var access_token = myStorage.getItem('access_token');
    fetch(apiURI + "toptracks?accesstoken=" + access_token)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var div_list = document.getElementById("show_top_tracks");
        div_list.innerHTML = '';
        var num = 1;
        data.forEach(element => {
            div_list.innerHTML += `<a class="track" id=${element.id} href=${element.external_urls.spotify} target="_blank">`;
            build_song(element, num);
            num++;
            div_list.innerHTML += '</a>';
        });
    })
    .catch(Error => { console.log(Error)})
});

const build_song = (element, num) => {
    var link = document.getElementById(element.id);

    // create container div
    var song_display = document.createElement('div');
    song_display.className = 'song__display__container';

    // create list number 
    var number = document.createElement('span');
    number.className = 'track__number';
    number.appendChild(document.createTextNode(num));

    // create image span
    var image_display = document.createElement('span');
    image_display.className = 'image__display';
    image_display.style['background-image'] = `url(${element.album.images[2].url})`;

    // create info span
    var info_display = document.createElement('span');
    info_display.className = 'info__display';

    var songname = document.createElement('span');
    songname.appendChild(document.createTextNode(element.name));
    songname.className = 'songname';
    info_display.appendChild(songname);

    var artists = document.createElement('ul');
    artists.className = 'artists__display';
    element.artists.forEach(artist => {
        var a = document.createElement('li');
        a.appendChild(document.createTextNode(artist.name));
        a.className = 'artist';
        artists.appendChild(a);
    });
    info_display.appendChild(artists);

    song_display.appendChild(number);
    song_display.appendChild(image_display);
    song_display.appendChild(info_display);

    link.appendChild(song_display);
};