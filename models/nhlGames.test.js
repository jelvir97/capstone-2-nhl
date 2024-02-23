"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");
const db = require("../db.js");
const NHL_Games= require("./nhlGames.js");
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

//TODO