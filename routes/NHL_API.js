const express = require('express')

const router = express.Router()

const NHL_API = require('../models/NHL_API')

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");

/**
 *  GET /nhl-api/schedule
 * 
 *  optional 'date' param.
 * 
 *  responds with schedule data
 * 
 */
router.get('/schedule', async(req, res, next)=>{
    try{
        const schedule = await NHL_API.getSchedule(req.query.date ? req.query.date : "now" )
        res.json(schedule)
    }catch(err){
        next(err)
    }
})

/**
 * GET /nhl-api/teams
 * 
 * responds with list of teams
 */
router.get('/teams', async(req,res,next)=>{
    try{
        const teams = await NHL_API.getTeamsList()
        res.json(teams)
    }catch(err){
        next(err)
    }
})

/**
 * GET /nhl-api/getStandings
 * 
 * responds with standings organized into conference/division
 */
router.get('/standings', async (req, res, next)=>{
    try{
        const standings = await NHL_API.getStandings()
        res.json(standings)
    }catch(err){
        next(err)
    }
})

/**
 * GET /nhl-api/:TEAM/schedule
 * 
 *  optional query 'date'
 * 
 * responds with team schedule
 */

router.get('/:team/schedule', async(req, res, next)=>{
    try{
        const schedule = await NHL_API.getTeamSchedule(req.params.team, 
                                                    req.query.date ? req.query.date : 'now')
        res.json(schedule)
    }catch(err){
        next(err)
    }
})

/**
 * GET /nhl-api/:TEAM/stats
 * 
 * responds with team stats
 */

router.get('/:team/stats', async(req,res,next)=>{
    try{
        const stats = await NHL_API.getTeamStats(req.params.team)
        res.json(stats)
    }catch(err){
        next(err)
    }
})

/**
 *  GET /nhl-api/:TEAM/roster
 * 
 *  responds with team roster
 */
router.get('/:team/roster', async (req,res,next)=>{
    try{
        const roster = await NHL_API.getTeamRoster(req.params.team)
        res.json(roster)
    }catch(err){
        next(err)
    }
})

/**
 *  GET /nhl-api/:gameID/play-by-play
 * 
 *  responds with play-by-play data
 */
router.get('/:gameID/play-by-play', async ( req, res, next)=>{
    try{
        const pbp = await NHL_API.getPlayByPlay(req.params.gameID)
        res.json(pbp)
    }catch(err){
        next(err)
    }
})

/**
 *  GET /nhl-api/spotlight
 * 
 */
router.get('/spotlight', async ( req, res, next)=>{
    try{
        const spotlight = await NHL_API.getSpotlight()
        res.json(spotlight)
    }catch(err){
        next(err)
    }
})


module.exports = router;