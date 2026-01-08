const leaderboardRouter = require('express').Router();

const { fetchLeaderboard } = require('../controllers/leaderboard.controller');

leaderboardRouter.get('/', fetchLeaderboard);

module.exports = leaderboardRouter;