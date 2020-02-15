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
$("#vol").click(function(){
    if($("#vIcon").hasClass("fa-volume-up")){
        $("#vIcon").removeClass("fa-volume-up");
        $("#vIcon").addClass("fa-volume-mute");
    }else{
        $("#vIcon").addClass("fa-volume-up");
        $("#vIcon").removeClass("fa-volume-mute");
    }
});
$(".close").click(function(){
    $("#form").css("display","none");
    $("#buttons").css("display","block");
    $("header").css("margin-top","120px");
});