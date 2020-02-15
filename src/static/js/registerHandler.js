function getRandomState(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
window.onload = () => {
  const login = document.getElementById("login");
  login.addEventListener("click", () => {
    const clientId = "BF5B3C4BA4A68";
    const redURL = "http://localhost:3000/oauth/redirect";

    // random state
    const state = getRandomState(16);

    sessionStorage.setItem("state", state);
    document.location.href = `https://accounts.csivit.com/oauth/authorize?clientId=${clientId}&redirectUrl=${redURL}&state=${state}`;
  });
};
$(document).ready(function() {
  var countDownDate = new Date("Feb 20, 2020 12:00:00").getTime();

  var x = setInterval(function() {
    var now = new Date().getTime();

    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $("p").html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

    if (distance < 0) {
      clearInterval(x);
      $("p").html("RiDdLe Me ThIs <br> RiDdLe Me ThAt");
    }
  }, 1000);
  $('[data-toggle="popover"]').popover();
  
  const backgroundMusic = new Audio("../static/audio/Nightcall  Instrumental_cutted.mp3");

  backgroundMusic.play();

  $("#vol").click(function(){
    if($("#vIcon").hasClass("fa-volume-up")){
        backgroundMusic.pause();
        $("#vIcon").removeClass("fa-volume-up");
        $("#vIcon").addClass("fa-volume-mute");

    }else{
        backgroundMusic.play();
        $("#vIcon").addClass("fa-volume-up");
        $("#vIcon").removeClass("fa-volume-mute");
    }
});
});
