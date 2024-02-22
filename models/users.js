"use strict";

const db = require("../db");
//const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const NHL_Games = require('./nhlGames')

const sportModels = {
  'nhl_games': NHL_Games
}


/** Related functions for users. */

class User {

  /** Add user with Google profile data.
   *
   * Returns { google_id, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ google_id, firstName, lastName, email, isAdmin=false }) {
    const result = await db.query(
          `INSERT INTO users
           (google_id,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING google_id, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          google_id,
          firstName,
          lastName,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ google_id, first_name, last_name, email, is_admin }, ...]
   * 
   *  FOR FUTURE ADMIN IMPLEMENTATION
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT google_id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY last_name`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, nhlGames}
   *   where jobs is [ gameID-1, gameID-2, gameID-3 ]
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(google_id) {
    const userRes = await db.query(
      `SELECT users. google_id,
            users.first_name AS "firstName",
            users.last_name AS "lastName",  
            users.email,
            users.is_admin AS "isAdmin", 
            json_agg(nhl_games) as "nhlGames"                                                                                         FROM users                                                                                                                                                    LEFT JOIN nhl_games_users AS games ON (users.google_id = games.google_id)
      LEFT JOIN nhl_games ON (games.game_id = nhl_games.game_id) 
      WHERE users.google_id = $1
      GROUP BY users.google_id;`,
        [google_id],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${google_id}`);

    user.nhlGames = user.nhlGames.map( g => g.game_id )

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /**
   * Track a game
   * 
   * Accepts {gameID, googleID, gameType}
   * 
   * RETURNS {msg: "googleID tracking gameID"}
   */

  static async track(gameID, googleID, gameType){
    let exists = await sportModels[gameType].getGame(gameID)
    
    if(!exists) await sportModels[gameType].addGame({gameID})

    const result = await db.query(
      `INSERT INTO ${gameType}_users
      (game_id,google_id)
      VALUES
      ($1,$2)
      RETURNING game_id AS "gameID", google_id AS "googleID"`,
      [gameID,googleID]
    )
    console.log(result.rows)
      
    return `${result.rows[0].googleID} tracking ${result.rows[0].gameID}`
  }

}


module.exports = User;
