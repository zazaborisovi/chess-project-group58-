const axios = require('axios');
const User = require("../models/user.model");

// oauth controllers here (facebook , google)

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const createSendToken = async (user, res) => {
  try{
    const token = user.signToken();
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'prod',
        sameSite: process.env.NODE_ENV == 'prod' ? 'none' : 'lax',
        maxAge: 3 * 24 * 60 * 60 * 1000,
    };

    res.status(200).cookie(process.env.COOKIE_NAME, token, cookieOptions)
    
    res.redirect(`${process.env.CLIENT_URL}/profile`);
  }catch(err){
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`)
  }
}

const getGoogleAuthUrl = (req , res) => {
    const params = new URLSearchParams({
        client_id: process.env.MAIN_GOOGLE_ID,
        redirect_uri: process.env.MAIN_GOOGLE_REDIRECT,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
    });
    
    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

const googleCallback = async (req , res) =>{
  try {
      const { code } = req.query;

      const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
            code,
            client_id: process.env.MAIN_GOOGLE_ID,
            client_secret: process.env.MAIN_GOOGLE_SECRET,
            redirect_uri: process.env.MAIN_GOOGLE_REDIRECT,
            grant_type: 'authorization_code'
        });

      const { access_token } = tokenResponse.data;

      const userInfo = await axios.get(GOOGLE_USERINFO_URL, {
          headers: {
              Authorization: `Bearer ${access_token}`
          }
      });

      const { email, name , sub } = userInfo.data;

      // First, check if user exists with this specific Google account
      let user = await User.findOne({ email });

      if(!user) {
          user = await User.create({
              username: name,
              email,
              oauthId: sub,
              oauthProvider: 'google'
          });
      }
      await createSendToken(user, res);
  } catch (err) {
      console.log(err);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
}

module.exports = {getGoogleAuthUrl , googleCallback}