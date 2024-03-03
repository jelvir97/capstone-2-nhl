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

  static async register({ googleID, firstName, lastName, email, isAdmin=false }) {
    const result = await db.query(
          `INSERT INTO users
           (google_id,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING google_id AS "googleID", first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          googleID,
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
          `SELECT google_id as "googleID",
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY last_name`,
    );

    return result.rows;
  }

  /** Given a googleID, return data about user.
   *
   * Returns { googleID, first_name, last_name, is_admin, nhlGames}
   *   where nhlGames is [ gameID-1, gameID-2, gameID-3 ]
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(googleID) {
    const userRes = await db.query(
      `SELECT users. google_id AS "googleID",
            users.first_name AS "firstName",
            users.last_name AS "lastName",  
            users.email,
            users.is_admin AS "isAdmin", 
            json_agg(nhl_games) as "nhlGames"                                                                                         FROM users                                                                                                                                                    LEFT JOIN nhl_games_users AS games ON (users.google_id = games.google_id)
      LEFT JOIN nhl_games ON (games.game_id = nhl_games.game_id) 
      WHERE users.google_id = $1
      GROUP BY users.google_id;`,
        [googleID],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${googleID}`);

    
    if(user.nhlGames[0] === null) user.nhlGames.pop()
    user.nhlGames = user.nhlGames.map( g => g.game_id )

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(googleID) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE google_id = $1
           RETURNING google_id`,
        [googleID],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${user}`);
  }

  /**
   * Track a game
   * 
   * Accepts {gameID, googleID, gameType}
   * 
   * RETURNS {msg: "googleID tracking gameID"}
   */

  static async track(gameID, googleID, gameType){
    if(!sportModels[gameType]) throw new BadRequestError('Must include gameType argument')
    let exists = await sportModels[gameType].getGame(gameID)
    
    if(!exists) await sportModels[gameType].addGame(gameID)

    try{
      const result = await db.query(
      `INSERT INTO ${gameType}_users
      (game_id,google_id)
      VALUES
      ($1,$2)
      RETURNING game_id AS "gameID", google_id AS "googleID"`,
      [gameID,googleID]
      )

      return {msg: `${result.rows[0].googleID} tracking ${result.rows[0].gameID}`}
    }catch(err){
      console.log(err)
      throw new NotFoundError(`No user with id: ${googleID}`)
    }
    
  }

  /**
   * Untracks a game
   * 
   * Accepts {gameID, googleID, gameType}
   * 
   * does not return anything
   */

  static async untrack(gameID, googleID, gameType){
    if(!gameType) throw new BadRequestError('Must include gameType argument')

      const {rowCount} = await db.query(`
      DELETE FROM ${gameType}_users
      WHERE google_id = $1 AND game_id = $2
      RETURNING google_id, game_id
    `, [googleID,gameID])

    if(!rowCount) throw new NotFoundError('User or game id not found')

  }

}


module.exports = User;
