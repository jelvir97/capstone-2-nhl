"use strict";

const db = require("../db");
const {BigQuery} =  require('@google-cloud/bigquery')

const bigqueryClient = new BigQuery()

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for NHL GAMES. */

class NHL_Games {
    /** Checks if game exists */
    static async getGame(gameID){
        const result = await db.query(
            `SELECT * FROM nhl_games
            WHERE game_id = $1
            `,
            [gameID]
        )

        return result.rows[0]
    }

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

    static async getPrediction (gameID){
        //TODO
        const query = `
        SELECT *
        FROM \`nhl-modeling.demo.dummy_game_data\`
        WHERE gameId = @gameID`

        const options = {
            query: query,
            location: 'US',
            params:{gameID: gameID}
        }
        
        const [rows] = await bigqueryClient.query(options);
        return rows[0];
    }

}

module.exports = NHL_Games;
