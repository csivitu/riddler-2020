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


    });