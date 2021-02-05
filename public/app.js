const params = new URLSearchParams(window.location.search);
const myStorage = window.localStorage;

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