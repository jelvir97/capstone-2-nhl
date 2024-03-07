const express = require('express')
const NHL_Games = require('../models/nhlGames')

const router = express.Router()

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");

const isAuthenticated = require('../middleware/isAuthenticated')
const isAdmin =  require('../middleware/isAdmin')

/** ROUTES FOR NHL_GAME predictions from BigQuery 
 * 
 *  root path: /nhl
*/

/**
 *  POST /nhl/predictions
 * 
 *  using POST to pass in multiple game id's in request body
 * 
 *  req.body should be : { gameIDs : ['game1', 'game2', 'game3', ...]}
 * 
 * responds with predictions:{
 *                              'game1':{
 *                                     gameID, moneyAway, moneyHome, model_money_prb_away, model_money_prb_home
 *                                      }, ...
 *                           }
 */
router.post('/predictions', isAuthenticated, async(req, res, next)=>{
    try{
        
        const gameIDs =  req.body.gameIDs
        if(!gameIDs) throw new BadRequestError('No gameIDs in request body')
        const predictions = await NHL_Games.getPrediction(...gameIDs)
        res.json(predictions)
    }catch(err){
        next(err)
    }
})


module.exports = router