// campaignEmojis
const fs = require('fs');
const csvWriter = require('csv-write-stream');

const Utils = require('./utils.js');

/**
 *
 * @param {string} fileName
 * @param {Array} data
 */
function writeToFile(fileName, data) {
  return new Promise((resolve, reject) => {
    try {
      const writer = csvWriter();
      Utils.ensureFolderExists('csv');
      const stream = fs.createWriteStream(`csv/${fileName}.csv`);

      writer.pipe(stream);

      data.forEach((row) => {
        writer.write({
          id: row._id['$oid'],
          emoji_id: row.emojiId,
          campaign_id: row.campaignId['$oid'],
          appreciator_id: row.appreciatorId,
          created_at: Utils.convertToMySQLTimestamp(row.createdAt['$date']),
          updated_at: Utils.convertToMySQLTimestamp(row.updatedAt['$date']),
        });
      });

      writer.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param {string} connection
 */

async function campaignEmojis(connection) {
  const mongoexportCommand = Utils.recordsExport('campaignEmojis');
  await Utils.executeCMDCommand(mongoexportCommand);
  Utils.giveReadPermission('campaignEmojis');
  const campaignEmojisParsedData = await Utils.parseJSONFile('campaignEmojis');
  try {
    await writeToFile('campaignEmojis', campaignEmojisParsedData);
    await Utils.loadDataFromCSVToMySQL(
      'csv/campaignEmojis.csv',
      'rnr_campaign_emojis',
      connection,
    );
  } catch (error) {
    console.error('Error => ', error);
  }
}

module.exports = campaignEmojis;
