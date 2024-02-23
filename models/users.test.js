"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");
const db = require("../db.js");
const User = require("./users.js");
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

/************************************** authenticate */

/************************************** AUTH TESTS in models/auth.test.js */

/************************************** register */

describe("register", function () {
  const newUser = {
    google_id: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register(newUser);
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE google_id = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE google_id = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
  });

});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        google_id: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      },
      {
        google_id: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com",
        isAdmin: false,
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("u2");
    expect(user).toEqual({
      googleID: "u2",
      firstName: "U2F",
      lastName: "U2L",
      email: "u2@email.com",
      isAdmin: false,
      nhlGames:[]
    });
  });

  test("works with tracked games listed", async function () {
    let user = await User.get("u1");
    expect(user).toEqual({
      googleID: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
      nhlGames:['game1','game2']
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

// TBD: not in user model yet;

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("u1");
    const res = await db.query(
        "SELECT * FROM users WHERE google_id='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/******************************* track */

describe('track', ()=>{
  
  test('works', async()=>{
    const res = await User.track('game1','u2','nhl_games')
    expect(res).toEqual({msg: `u2 tracking game1`})
  })

  test('works with new gameID', async ()=>{
    const res = await User.track('newGame','u2','nhl_games');
    expect(res).toEqual({msg: `u2 tracking newGame`})
    
  })

  test('fails user not found', async ()=>{
    expect.assertions(1)
    try {
      await User.track('game1','not-a-user','nhl_games');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  })

  test('fails with BadRequestError; no gameType', async ()=>{
    expect.assertions(1)
    try {
      await User.track('game1','u2');
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })
})

/********************************* untrack */

describe('untrack', ()=>{
  test('works', async ()=>{
    await User.untrack('game1','u1','nhl_games')
    const {nhlGames} = await User.get('u1');

    expect(nhlGames.length).toEqual(1)
    expect(nhlGames).toEqual(['game2'])
  })

  test('fails user not found', async ()=>{
    expect.assertions(1)
    try {
      await User.untrack('game1','not-a-user','nhl_games');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  })

  test('fails game not found', async ()=>{
    expect.assertions(1)
    try {
      await User.untrack('game0','u1','nhl_games');
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  })

  test('fails with BadRequestError; no gameType', async ()=>{
    expect.assertions(1)
    try {
      await User.untrack('game1','u1');
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })
})
