"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = process.env.PORT || 3001;

const COOKIE_KEYS = process.env.COOKIE_KEYS

const NHL_MODEL_URI = process.env.NHL_MODEL_URI

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

console.log(BASE_URL)

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///nhl_model_test"
      : process.env.DATABASE_URL || "postgresql:///nhl_model";
}


console.log("NHL_Model Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  COOKIE_KEYS,
  getDatabaseUri,
  NHL_MODEL_URI,
  BASE_URL
};