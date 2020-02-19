window.onload = () => {
    const tracksDOM = document.getElementsByTagName('button');
    const question = document.querySelector('#question');

    // Starter questiosn are hardcoded
    const questions = ['a', 'b', 'c'];
    const tracks = Object.values(tracksDOM);
    console.log(tracks);
    tracks.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let trackSelected = 1;
            for (let i = 0; i < tracks.length; i += 1) {
                if (tracks[i] === e.target) trackSelected = i;
            }

            let riddleID;
            switch (trackSelected) {
            case 0:
                riddleID = 'A0';
                break;
            case 1:
                riddleID = 'B0';
                break;
            case 2:
                riddleID = 'C0';
                break;
            default:
                riddleID = 'A0';
            }
            question.innerHTML = questions[trackSelected];
            console.log(riddleID);
            const url = `${window.location.origin}/game?id=${encodeURI(riddleID)}`;
            console.log(url);

            window.location.href = url;
        });
    });
};
