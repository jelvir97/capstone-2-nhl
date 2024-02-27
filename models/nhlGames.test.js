"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");
const db = require("../db.js");


const NHL_Games = require("./nhlGames.js");
const bigqueryClient =  require('../middleware/BigQueryClient.js')
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

/*********************** getGame */
describe('getGame', ()=>{
    test('works', async()=>{
        const res = await NHL_Games.getGame('game1')
        expect(res).toEqual(true)
    })

    test('fails - returns false', async()=>{
        const res = await NHL_Games.getGame('not-a-game')
        expect(res).toEqual(false)
    })
})

/*********************** addGame */
describe('addGame', ()=>{
    test('works', async ()=>{
        const res = await NHL_Games.addGame('new-game')
        const games = await db.query(`SELECT * FROM nhl_games`)
        expect(games.rows.length).toEqual(3)
        expect(games.rows[2].game_id).toEqual('new-game')
    })

    test('fails duplicate id', async ()=>{
        expect.assertions(1)
        try{
            const res = await NHL_Games.addGame('game1')
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }

    })

})

/*********************** getPrediction */

jest.spyOn(bigqueryClient, 'query').mockImplementation(async(options)=>{
    console.log(options.params.gameID)
    const data = options.params.gameID.map(g => ({ gameID: g, 
                                                    moneyAway:g+'moneyAway',
                                                    moneyHome: g+'moneyHome',
                                                    model_prb_money_home: g+'modelHome',
                                                     model_prb_money_away: g+'modelAway'
                                                }))
    return [data]
})

describe('getPrediction',  ()=>{
    test('works', async ()=>{
        const res = await NHL_Games.getPrediction('game1')

        expect(res).toEqual({
            game1: {
              gameID: 'game1',
              moneyAway: 'game1moneyAway',
              moneyHome: 'game1moneyHome',
              model_prb_money_home: 'game1modelHome',
              model_prb_money_away: 'game1modelAway'
            }
          })
        
    })

    test('works with multiple ids', async ()=>{
        const res = await NHL_Games.getPrediction('game1','game2','game3')

        expect(res).toEqual({
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
})