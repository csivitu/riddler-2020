function getRandomState(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
window.onload = () => {
    const login = document.getElementById('login');
    login.addEventListener('click', () => {
        const clientId = 'BF5B3C4BA4A68';
        const redURL = 'http://localhost:3000/oauth/redirect';

        // random state
        const state = getRandomState(16);

        sessionStorage.setItem('state', state);
        document.location.href = `https://accounts.csivit.com/oauth/authorize?clientId=${clientId}&redirectUrl=${redURL}&state=${state}`;
    });
};
$(document).ready(() => {
    const countDownDate = new Date('Feb 20, 2020 12:00:00').getTime();

    const x = setInterval(() => {
        const now = new Date().getTime();

        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $('.timer').html(`${days}d ${hours}h ${minutes}m ${seconds}s `);

        if (distance < 0) {
            clearInterval(x);
            $('.timer').html('. 尺ﾉりりﾚ乇尺 .');
        }
    }, 1000);
    $('[data-toggle="popover"]').popover();

    const backgroundMusic = new Audio('../static/audio/moosic.mp3');
    const clickMusic = new Audio('../static/audio/click.mp3');

    $(document.body).click((e) => {
        clickMusic.pause();
        clickMusic.currentTime = 0;
        clickMusic.play();

        if (Math.random() <= 0.05) {
            // eslint-disable-next-line no-alert
            alert('HEADSHOT');
        }
    });
    backgroundMusic.play();

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
