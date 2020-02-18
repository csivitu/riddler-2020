window.onload = () => {
    const tracks = document.getElementsByTagName('button');
    tracks.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const trackSelected = tracks.findIndex(e.target);
            // will return if track 1 2 3,
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
            const url = `http://localhost/maze?id=${riddleID}`;
            window.location.href = url;
        });
    });
};
