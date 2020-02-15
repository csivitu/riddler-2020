function getRandomState(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
window.onload = () => {
  const login = document.getElementById("login");
  login.addEventListener("click", () => {
    const clientId = "BF5B3C4BA4A68";
    const redURL = "http://localhost:3000/oauth/redirect";

    // random state
    const state = getRandomState(16);

    sessionStorage.setItem("riddlerState", state);
    document.location.href = `https://accounts.csivit.com/oauth/authorize?clientId=${clientId}&redirectUrl=${redURL}&state=${state}`;
  });
};
