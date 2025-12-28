const oauthRouter = require('express').Router()
const { getGoogleAuthUrl, googleCallback } = require('../controllers/oauth.controllers')

oauthRouter.get("/google" , getGoogleAuthUrl)
oauthRouter.get("/google/callback" , googleCallback)

module.exports = oauthRouter