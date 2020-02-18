const fetch = require('node-fetch');

const getApiData = async (url, settings) => {
    try {
        const response = await fetch(url, settings);
        const data = await response.json();
        return data;
    } catch (e) {
        return e;
    }
};

module.exports = getApiData;
