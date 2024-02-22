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
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(google_id) {
    const userRes = await db.query(
          `SELECT google_id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE google_id = $1`,
        [google_id],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${google_id}`);

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
