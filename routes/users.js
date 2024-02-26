const express = require('express')
const User = require('../models/users')

const router = express.Router()

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

router.get('/', isAdmin, async (req,res,next)=>{
    try{
        const users = await User.findAll()
        return res.json(users)
    }catch(err){
        next(err)
    }
})



module.exports = router;