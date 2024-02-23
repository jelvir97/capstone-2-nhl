const db = require("../db.js");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM nhl_games");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM nhl_games_users");

  await db.query(`
    INSERT INTO nhl_games(game_id)
    VALUES ('game1'),
           ('game2')
           `);

  await db.query(`
        INSERT INTO users(google_id,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', 'U1F', 'U1L', 'u1@email.com'),
               ('u2', 'U2F', 'U2L', 'u2@email.com')
        RETURNING google_id`);

  await db.query(`
      INSERT INTO nhl_games_users
          (google_id, game_id)
      VALUES ('u1', 'game1'),
             ('u1', 'game2')`)
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