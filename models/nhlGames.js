"use strict";

const db = require("../db");
const {NHL_MODEL_URI} = require('../config')
const bigqueryClient = require('../middleware/BigQueryClient')

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for NHL GAMES. */

class NHL_Games {
    /** Checks if game exists -- returns boolean */
    static async getGame(gameID){
        const result = await db.query(
            `SELECT * FROM nhl_games
            WHERE game_id = $1
            `,
            [gameID]
        )

        return result.rows[0] ? true : false;
    }

    /** Add game_id to db
     * 
     *  Accepts: {game_id}
     * 
     * Returns : {game_id}
    */
    static async addGame(gameID){
        try{const result = await db.query(
            `INSERT INTO nhl_games
            (game_id)
            VALUES
            ($1)
            RETURNING game_id AS "gameID"
            `,
            [gameID]
        )

        return result.rows[0]
    }catch(err){
        throw new BadRequestError(`gameID ${gameID} already exists.`)
    }
    }

    /**
     * Gets predictions from BigQuery model
     */

    static async getPrediction (...gameIDs){
        //TODO
        const query = `
        SELECT gameId AS gameID, moneyHome, moneyAway, model_prb_money_home, model_prb_money_away
        FROM ${NHL_MODEL_URI}
        WHERE gameId IN UNNEST(@gameID)
        ORDER BY gameId`

        const options = {
            query: query,
            location: 'US',
            params:{gameID: gameIDs}
        }

        const [rows] = await bigqueryClient.query(options);
        

        const predictions = {}
        for(let row of rows){
            predictions[row.gameID] = row;
        }
        return predictions;
    }

}

module.exports = NHL_Games;
