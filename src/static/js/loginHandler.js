window.onload = () => {
  const res = decodeURI(window.location.search)
    .replace("?", "")
    .split("&")
    .map(param => param.split("="))
    .reduce((values, [key, value]) => {
      values[key] = value;
      return values;
    }, {});
  sessionStorage.setItem("token", res.token);
  sessionStorage.setItem("state", res.state);
};
