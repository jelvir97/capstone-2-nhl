const db = require("../db.js");

const User = require('../models/users.js')
const NHL_Games = require('../models/nhlGames.js')

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM nhl_games");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM nhl_games_users");

  await User.register(
            { google_id: 'u1',
              firstName: 'u1-first',
              lastName:  'u1-last',
              email: 'u1@test.com',
              isAdmin: true })
  
  await User.register(
            { google_id: 'u2',
              firstName: 'u2-first',
              lastName:  'u2-last',
              email: 'u2@test.com',
              isAdmin: false })

  await NHL_Games.addGame('game1')

  await NHL_Games.addGame('game2')

  await User.track('game1','u2','nhl_games')
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};