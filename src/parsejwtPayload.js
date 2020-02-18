const atob = require('atob');

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return 'error is jwt parsing: ';
    }
};

module.exports = parseJwt;
