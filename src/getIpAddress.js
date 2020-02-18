const getApiCall = require("./getApiData");

//return the ip address as a string

const getIpAddress = async () => {
  const api = "https://api.ipify.org?format=json";
  const settings = {
    method: "GET"
  };
  try {
    const response = await getApiCall(api, settings);
    return response;
  } catch (err) {
    console.log("failed to retrieve the ip address");
    return err;
  }
};

module.exports = getIpAddress;
