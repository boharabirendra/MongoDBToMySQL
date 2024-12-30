require('dotenv').config({ path: __dirname + '/../.env' });

const mongoSecrets = {
  HOST: process.env.MONGO_DB_HOST,
  USER: process.env.MONGO_DB_USERNAME,
  PASSWORD: process.env.MONGO_DB_PASSWORD,
  PORT: process.env.MONGO_DB_PORT,
  DATABASE: process.env.MONGO_DB_NAME,
};

const SQLSecrets = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DB_NAME,
  PORT: process.env.DB_PORT,
};

module.exports = { mongoSecrets, SQLSecrets };
