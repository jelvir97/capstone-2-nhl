"use strict";

const requests = require('supertest')

const app = require('../app.js')
const MockAuth = require('../middleware/MockAuth.js')
const bigqueryClient = require('../middleware/BigQueryClient.js')


const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const u1 = { googleID: 'u1',
    firstName: 'u1-first',
    lastName:  'u1-last',
    email: 'u1@test.com',
    isAdmin: true,
    nhlGames: [] 
} 

jest.spyOn(bigqueryClient, 'query').mockImplementation(async(options)=>{
    const data = options.params.gameID.map(g => ({ gameID: g, 
                                                    moneyAway:g+'moneyAway',
                                                    moneyHome: g+'moneyHome',
                                                    model_prb_money_home: g+'modelHome',
                                                     model_prb_money_away: g+'modelAway'
                                                }))
    return [data]
})

jest.mock('../middleware/MockAuth.js')

describe('POST /nhl/predictions', ()=>{
    test('works with authenticated user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            req.session = {}
            req.session.passport = {user : u1.googleID};
            req.user = u1;
            next()
        })


        const res = await requests(app).post('/nhl/predictions').send({gameIDs:['game1']})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
                                    game1: {
                                    gameID: 'game1',
                                    moneyAway: 'game1moneyAway',
                                    moneyHome: 'game1moneyHome',
                                    model_prb_money_home: 'game1modelHome',
                                    model_prb_money_away: 'game1modelAway'
                                    }
                                })
    })

    test('works with multiple gameIDs', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session = {}
            req.session.passport = {user : u1.googleID};
            req.user = u1;
            next()
        })


        const res = await requests(app).post('/nhl/predictions').send({gameIDs:['game1','game2','game3']})

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(    {
            game1: {
              gameID: 'game1',
              moneyAway: 'game1moneyAway',
              moneyHome: 'game1moneyHome',
              model_prb_money_home: 'game1modelHome',
              model_prb_money_away: 'game1modelAway'
            },
            game2: {
              gameID: 'game2',
              moneyAway: 'game2moneyAway',
              moneyHome: 'game2moneyHome',
              model_prb_money_home: 'game2modelHome',
              model_prb_money_away: 'game2modelAway'
            },
            game3: {
              gameID: 'game3',
              moneyAway: 'game3moneyAway',
              moneyHome: 'game3moneyHome',
              model_prb_money_home: 'game3modelHome',
              model_prb_money_away: 'game3modelAway'
            }
          })
    })

    test('fails with unauth user', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            next()
        })

        const res = await requests(app).post('/nhl/predictions').send({gameIDs:['game1']})
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({ error: { message: 'Must be logged in', status: 401 } })
    })

    test('fails with no gameIDs', async()=>{
        
        MockAuth.mockImplementation((req,res,next)=>{
            req.session = {}
            req.session.passport = {user : u1.googleID};
            req.user = u1;
            next()
        })

        const res = await requests(app).post('/nhl/predictions')
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: { message: 'No gameIDs in request body', status: 400 } })
    })

})