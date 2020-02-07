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
