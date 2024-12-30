const mysql = require('mysql2/promise');
const { exec } = require('child_process');

const emojis = require('./emojis');
const images = require('./images');
const campaigns = require('./campaign');
const categories = require('./categories');
const { SQLSecrets } = require('./config');
const appreciation = require('./appreciations');
const campaignEmojis = require('./campaignEmojis');
const appreciationLikes = require('./appreciationLikes');
const appreciationTypes = require('./appreciationTypes');

(async () => {
  const connection = await mysql.createConnection({
    host: SQLSecrets.HOST,
    user: SQLSecrets.USER,
    password: SQLSecrets.PASSWORD,
    database: SQLSecrets.DATABASE,
    port: SQLSecrets.PORT,
  });
  try {
    await categories(connection);
    await campaigns(connection);
    await appreciationTypes(connection);
    await appreciation(connection);
    await appreciationLikes(connection);
    await campaignEmojis(connection);
    await emojis(connection);
    await images(connection);
  } catch (error) {
    console.error('Error ', error);
  } finally {
    exec('rm -r csv');
    exec('rm -r json');
    await connection.end();
  }
})();
