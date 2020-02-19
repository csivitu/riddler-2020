window.onload = () => {
    const tracksDOM = document.getElementsByTagName('button');
    const question = document.querySelector("#question");

    //Starter questiosn are hardcoded
    const questions = ["a", "b", "c"];
    const tracks = Object.values(tracksDOM);
    console.log(tracks);
    tracks.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const trackSelected;
            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i] === e.target)
                    trackSelected = i;
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
            p.innerHTML = questions[trackSelected];
            console.log(riddleID);
            const url = `${location.origin}/game?id=${encodeURI(riddleID)}`;
            console.log(url);

            window.location.href = url;
        });
    });
};
