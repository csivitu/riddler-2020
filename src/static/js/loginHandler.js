window.onload = () => {
    // decoding the conetnts of the query string
    const res = decodeURI(window.location.search)
        .replace('?', '')
        .split('&')
        .map((param) => param.split('='))
        .reduce((values, [key, value]) => {
            const val = values;
            val[key] = value;
            return val;
        }, {});
    sessionStorage.setItem('token', res.token);

    // state checking
    const clientState = sessionStorage.getItem('state', res.state);
    const serverState = res.state;
    if (clientState !== serverState) {
        document.body.write('client and server state does not match. ');
    }
};
