$(document).ready(function () {
    const backgroundMusic = new Audio("../static/audio/Nightcall  Instrumental_cutted.mp3");

    backgroundMusic.play();

    $("#vol").click(function () {
        if ($("#vIcon").hasClass("fa-volume-up")) {
            backgroundMusic.pause();
            $("#vIcon").removeClass("fa-volume-up");
            $("#vIcon").addClass("fa-volume-mute");

        } else {
            backgroundMusic.play();
            $("#vIcon").addClass("fa-volume-up");
            $("#vIcon").removeClass("fa-volume-mute");
        }
    });
});
