function getRandomIntInclusive(min, max) {
    const minTemp = Math.ceil(min);
    const maxTemp = Math.floor(max);
    return Math.floor(
        Math.random() * (maxTemp - minTemp + 1),
    ) + minTemp; // The maximum is inclusive and the minimum is inclusive
}

window.onload = () => {
    const login = document.getElementById('login');
    login.addEventListener('click', () => {
        const clientId = 'BF5B3C4BA4A68';
        const redURL = 'http://localhost:3000/oauth/redirect';

        // random state
        const array = new Uint32Array(10);
        window.crypto.getRandomValues(array);
        const index = getRandomIntInclusive(0, 9);
        const state = array[index];


        sessionStorage.setItem("stateClient",state);
        document.location.href = `https://accounts.csivit.com/oauth/authorize?clientId=${clientId}&redirectUrl=${redURL}&state=${state}`;
    });
};
$(document).ready(function(){


    var countDownDate = new Date("Feb 20, 2020 12:00:00").getTime();

    var x = setInterval(function() {

    var now = new Date().getTime();

    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $("p").html(days + "d " + hours + "h "+ minutes + "m " + seconds + "s ");

    if (distance < 0) {
      clearInterval(x);
      $("p").html ("RiDdLe Me ThIs <br> RiDdLe Me ThAt");
    }

    }, 1000);
    $('[data-toggle="popover"]').popover();
    const backgroundMusic = new Audio('../static/audio/Nightcall  Instrumental_cutted.mp3');
    backgroundMusic.play();


    const audioIcon = $(".controller");
   /* audioIcon.on("click", function() {
  if (audioIcon.dataset.mute === "true") {
    backgroundMusic.play();
    //audioIcon.style.backgroundImage = "url('/static/images/volume-on.png')";
    audioIcon.dataset.mute = "false";
  } else {
    backgroundMusic.pause();
    //audioIcon.style.backgroundImage = "url('/static/images/volume-off.png')";
    audioIcon.dataset.mute = "true";
  }
  audioIcon.classList.toggle("is-success");
  audioIcon.classList.toggle("is-error");*/
});
