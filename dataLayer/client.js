const pg = require("pg");

const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/vid_roulette");
client.connect();

module.exports = { client };

