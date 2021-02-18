const params = new URLSearchParams(window.location.search);
const myStorage = window.localStorage;

const apiURI = "http://localhost:3000/api/";

myStorage.setItem('num_of_songs_selected', 0);
myStorage.setItem('songs-selected', '');

window.addEventListener('load', () => {
    if (!params.has('access_token')) {
        // console.log ("access_token: " + myStorage.getItem('access_token'));
        return;
    }
    var access_token = params.get('access_token');
    var refresh_token = params.get('refresh_token');
    myStorage.setItem("access_token", access_token);
    myStorage.setItem("refresh_token", refresh_token);
    // console.log("access token: " + access_token);
    window.location.href = '/explore';
});

window.addEventListener('click', () => {
    var element = document.getElementById('total-selected');
    element.innerHTML = 'Number of songs selected: ' + myStorage.getItem('num_of_songs_selected');
});

window.addEventListener('DOMContentLoaded', () => {
    var access_token = myStorage.getItem('access_token');
    fetch(apiURI + "toptracks?accesstoken=" + access_token)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            var num = 1;
            data.forEach(element => {
                build_song(element, num);
                num++;
            });
        })
        .catch(Error => { console.log(Error) })
});

const add_function = (e) => {
    if (e.target.disabled) {
        return;
    }

    // update num of songs
    var num = parseInt(myStorage.getItem('num_of_songs_selected'), 10);

    if (num >= 12) {
        return;
    }
    
    myStorage.setItem('num_of_songs_selected', num + 1);
    e.target.className = 'add-button nohover';
    e.target.disabled = true;

    var id = e.target.id.substring(7);
    var access_token = myStorage.getItem('access_token');

    fetch(apiURI + "getTrack?accesstoken=" + access_token + "&id=" + id)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            add_song(data);
            var songlist = myStorage.getItem('songs-selected');
            if (songlist == '') {
                songlist = data.id;
            } else {
                songlist += "_";
                songlist += data.id;
            }
            myStorage.setItem('songs-selected', songlist);
            // console.log(myStorage.getItem('songs-selected'));
        })
        .catch(Error => { console.log(Error) })
}

const add_song = (element) => {
    var container = document.getElementsByClassName('selected-tracks-container')[0];

    var track_container = document.createElement('div');
    track_container.className = 'track__container';
    track_container.id = 'c-' + element.id;
    container.appendChild(track_container);

    var track_mask = document.createElement('div');
    track_mask.className = 'track-mask';
    track_mask.innerHTML = "REMOVE";
    track_container.appendChild(track_mask);

    var track = document.createElement('div');
    track.className = 'selected-track';
    track_container.appendChild(track);

    var image = document.createElement('div');
    image.className = 'track-image';
    image.style['background-image'] = `url(${element.album.images[2].url})`;
    track.appendChild(image);

    var name = document.createElement('div');
    name.className = 'track-name';
    name.innerHTML = element.name;
    track.appendChild(name);

    track_container.addEventListener('click', remove_song);
};

const build_song = (element, num) => {
    var div_list = document.getElementById("show_top_tracks");

    var track_container = document.createElement('div');
    track_container.className = 'track-container animate__animated animate__fadeInDown';
    track_container.style.animationDelay = `${0.1 * num}s`;
    div_list.appendChild(track_container);

    var link = document.createElement('a');
    link.className = 'track';
    link.id = element.id;
    link.href = element.external_urls.spotify;
    link.target = '_blank';
    track_container.appendChild(link);

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

    var track_length = document.createElement('span');
    track_length.className = 'track_length';
    var min = Math.floor(element.duration_ms / 60000);
    var sec = Math.floor((element.duration_ms - min * 60000) / 1000);
    track_length.innerHTML = min + ':' + sec;

    song_display.appendChild(number);
    song_display.appendChild(image_display);
    song_display.appendChild(info_display);
    song_display.appendChild(track_length);

    link.appendChild(song_display);

    var add_button = document.createElement('button');
    add_button.className = 'add-button';
    add_button.id = 'button-' + element.id;
    add_button.innerHTML = 'ADD';
    track_container.appendChild(add_button);
    add_button.addEventListener('click', add_function);
};

const remove_song = (e) => {
    var el = e.target.parentNode;
    if (el.className != 'track__container') {
        el = el.parentNode;
    }
    if (el.className != 'track__container') {
        return;
    }
    var id = el.id.substring(2);
    var songlist = myStorage.getItem('songs-selected');
    songlist = songlist.replace(id, '');
    songlist = songlist.replace('__', '_');
    if (songlist.charAt(songlist.length - 1) == '_') {
        songlist = songlist.slice(0, -1);
    } else if (songlist.charAt(0) == '_') {
        songlist  = songlist.slice(1);
    } else if (songlist == '_') {
        songlist = '';
    }
    myStorage.setItem('songs-selected', songlist);
    // console.log(myStorage.getItem('songs-selected'));

    var num = parseInt(myStorage.getItem('num_of_songs_selected'), 10);
    myStorage.setItem('num_of_songs_selected', num - 1);


    var button = document.getElementById('button-' + id);
    button.disabled = false;

    el.remove();
};