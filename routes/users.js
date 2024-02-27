const express = require('express')
const User = require('../models/users')

const router = express.Router()

const isAuthenticated = require('../middleware/isAuthenticated')
const isAdmin =  require('../middleware/isAdmin')


/******* ROUTES for USER model 
 * 
 *   path root '/users'
*/


/**
 *  GET /users
 * 
 *  returns list of all users:
 *      [ { user1,... }, { user2,... }, ... ]
 * 
 *  where user objet includes {
 *                  googleID,
 *                  firstName,
 *                  lastName,
 *                  email, 
 *          }
 */

router.get('/', isAuthenticated, isAdmin, async (req,res,next)=>{
    try{
        console.log(req.session)
        const users = await User.findAll()
        return res.json(users)
    }catch(err){
        next(err)
    }
})

/**
 * GET /users/:id
 * 
 *   returns user:{
 *                  googleID,
 *                  firstName,
 *                  lastName,
 *                  email, 
 *                  nhlGames: []}
 */

router.get('/:id', async(req,res,next)=>{
    try{
        const user = await User.get(req.params.id)
        return res.json(user)
    }catch(err){
        next(err)
    }
})




/**
 * DELETE /users/:id
 * 
 *  returns: undefined
 */

router.post('/:id', async(req,res,next)=>{
    try{
        await User.remove(req.params.id)
        return res.end()
    }catch(err){
        next(err)
    }
})


/**
 * POST /users/:gameType/:gameID
 * 
 *  lets users track games
 * 
 * returns {msg: "googleID tracking gameID"}
 */

router.post('/:gameType/:gameID', async (req,res,next)=>{
    try{
        const msg = await User.track(req.params.gameID, req.session.user.googleID, req.params.gameType)
        return res.json(msg)
    }catch(err){
        next(err)
    }
})


/**
 * DELETE /users/:gameType/:gameID
 * 
 * lets users untrack games
 * 
 * returns undefined
 */

router.delete('/:gameType/:gameID', async (req,res,next)=>{
    try{
        await User.untrack(req.params.gameID,req.session.user.googleID, req.params.gameType)
        res.end()
    }catch(err){
        next(err)
    }
})






module.exports = router;