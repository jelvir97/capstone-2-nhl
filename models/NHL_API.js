"use strict";

const axios = require("axios");

const { BadRequestError } = require("../expressError");

/**
 *  For routing nhl api requests through server.
 *
 *  https://api.nhle.com
 *  https://api-web.nhle.com
 *
 *  ****These do not support CORS****
 */
class NHL_API {
  /**
   * Gets schedule for 'now'
   *
   *  or date passed in
   *
   *  date must be string : 'YYYY-MM-DD'
   */
  static async getSchedule(date = "now") {

    // For Demo Purposes date is hardcoded to 2024-04-01
    // Should Be : /v1/schedule/${date}
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/schedule/2024-01-01`,
    );

    return data;
  }

  /**
   *
   * Gets list of teams
   *
   *   Takes no arguments
   */
  static async getTeamsList() {
    const { data } = await axios.get(`https://api.nhle.com/stats/rest/en/team`);
    return data.data.slice(27);
  }

  /**
   * Gets standings data for entire league
   *
   * returns mapped object organized into conferences/divisions
   */
  static async getStandings() {
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/standings/now`,
    );
    const { standings } = data;
    const obj = {
      Western: {
        Pacific: [],
        Central: [],
      },
      Eastern: {
        Atlantic: [],
        Metropolitan: [],
      },
    };

    standings.forEach((team) => {
      obj[team.conferenceName][team.divisionName].push(team);
    });

    return obj;
  }

  /**
   * Gets player stats for team
   *
   * Must pass in team abbreviation
   */
  static async getTeamStats(team) {
    if (!team) throw new BadRequestError("Must have team abbreviation");
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/club-stats/${team}/now`,
    );

    return data;
  }

  /**
   * Gets current team schedule
   *
   * Must pass in team abbreviation
   */
  static async getTeamSchedule(team, date = "now") {
    if (!team) throw new BadRequestError("Must have team abbreviation");
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/club-schedule/${team}/week/${date}`,
    );
    return data;
  }

  /**
   * Gets current team roster
   *
   * Must pass in team abbreviation
   */
  static async getTeamRoster(team) {
    if (!team) throw new BadRequestError("Must have team abbreviation");
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/roster/${team}/current`,
    );
    return data;
  }

  /**
   *  Gets Play-by-play data for a game;
   *
   *  Must pass in gameID
   */
  static async getPlayByPlay(gameID) {
    if (!gameID) throw new BadRequestError("Must have gameID");
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/gamecenter/${gameID}/play-by-play`,
    );
    return data;
  }

  /**
   *  Gets spotlight players;
   *
   *
   */
  static async getSpotlight(gameID) {
    const { data } = await axios.get(
      `https://api-web.nhle.com/v1/player-spotlight`,
    );
    return data;
  }
}

module.exports = NHL_API;
