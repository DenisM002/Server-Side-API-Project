// Depencencies
const authConfig = require("../config/auth_config.json");
const axios = require('axios').default;

let getAuthUser = async (accessToken) => {

    // Get user info from Auth0
    // include the access token in the authorization header
    const url = `${authConfig.issuer}userinfo`;
    const config = {
      headers: {
        "authorization": `Bearer ${accessToken}`
      }
    }
    // Use axios to make request
    const user = await axios.get(url, config);

    // return the user data
    return user.data;
}

// Returns user email address
let getAuthUserEmail = async (accessToken) => {

  // Get user info from Auth0
  // include the access token in the authorization header
  let userEmail;

  const url = `${authConfig.issuer}userinfo`;
  const config = {
    headers: {
      "authorization": `Bearer ${accessToken}`
    }
  }
  // Use axios to make request
  const user1 = await axios.get(url, config);
  userEmail = user1.data.email;

  // return the user data
  return userEmail;
}


// Module exports
// expose these functions
module.exports = {
    getAuthUser,
    getAuthUserEmail
};