$(document).ready(() => {
    const countDownDate = new Date('Feb 21, 2020 00:30:00').getTime();

    const x = setInterval(() => {
        const now = new Date().getTime();

        const distance = countDownDate - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $('.timer').html(`${hours}h ${minutes}m ${seconds}s `);

        if (distance < 0) {
            clearInterval(x);
            $('.timer').html('. 尺ﾉりりﾚ乇尺 .');
        }
    }, 1000);
    $('[data-toggle="popover"]').popover();

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
});
