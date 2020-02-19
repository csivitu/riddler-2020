const backgroundMusic = new Audio('../static/audio/moosic.mp3');
const clickMusic = new Audio('../static/audio/click.mp3');

let ammo = true;
let count = 0;
$(document.body).click(() => {
    if (ammo) {
        clickMusic.pause();
        clickMusic.currentTime = 0;
        clickMusic.play();
        count += 1;
    }
    if (count > 50 && ammo) {
        // eslint-disable-next-line no-alert
        alert('OUT OF AMMO');
        ammo = false;
    }
});
backgroundMusic.addEventListener('ended', function autoplay() {
    this.currentTime = 0;
    this.play();
}, false);

$('#vol').click(() => {
    if ($('#vIcon').hasClass('fa-volume-up')) {
        backgroundMusic.pause();
        $('#vIcon').removeClass('fa-volume-up');
        $('#vIcon').addClass('fa-volume-mute');
    } else {
        backgroundMusic.play();
        $('#vIcon').addClass('fa-volume-up');
        $('#vIcon').removeClass('fa-volume-mute');
    }
});
