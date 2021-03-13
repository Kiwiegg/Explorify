var about_page = document.getElementById('about');
var explore_page = document.getElementById('explore');

about_page.addEventListener('click', () => {
    about_page.className = "app-nav__link current";
    explore_page.getElementsByClassName =  "app-nav__link";
})

explore_page.addEventListener('click', () => {
    explore_page.className = "app-nav__link current";
    about_page.getElementsByClassName =  "app-nav__link";
})