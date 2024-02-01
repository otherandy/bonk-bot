const Keyv = require("keyv");

const DATABASE_URL = process.env.REDIS_URL;
const db = {};

const newKeyv = (namespace) => new Keyv(DATABASE_URL, { namespace });

db.info = newKeyv("info");
db.bonks = newKeyv("bonks");

const error = (err) => console.error("Keyv connection error:", err);

db.info.on("error", error);
db.bonks.on("error", error);

module.exports = db;
