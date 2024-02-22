"use strict";

const db = require("../db");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for NHL GAMES. */

class NHL_Games {
    /** Add game_id to db
     * 
     *  Accepts: {game_id}
     * 
     * Returns : {game_id}
    */
    static async addGame({gameID}){
        const result = await db.query(
            `INSERT INTO nhl_games
            (game_id)
            VALUES
            ($1)
            RETURNING game_id AS "gameID"
            `,
            [gameID]
        )

        return result.rows[0]
    }

    /**
     * Gets predictions from BigQuery model
     */

    static async getPrediction ({gameID}){
        //TODO
    }

}

module.exports = NHL_Games;
