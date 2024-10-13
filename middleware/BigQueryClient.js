//INITIALIZING BigQuery Client

const { BigQuery } = require("@google-cloud/bigquery");

const bigqueryClient = new BigQuery();

module.exports = bigqueryClient;
