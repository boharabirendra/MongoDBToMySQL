// emojis
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
          created_by_name: row.createdBy.name,
          created_by_id: row.createdBy.id,
          created_by_emp_id: row.createdBy.empId,
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

async function emojis(connection) {
  const mongoexportCommand = Utils.recordsExport('emojis');
  await Utils.executeCMDCommand(mongoexportCommand);
  Utils.giveReadPermission('emojis');
  const emojisParsedData = await Utils.parseJSONFile('emojis');
  try {
    await writeToFile('emojis', emojisParsedData);
    await Utils.loadDataFromCSVToMySQL(
      'csv/emojis.csv',
      'rnr_emojis',
      connection,
    );
  } catch (error) {
    console.error('Error => ', error);
  }
}

module.exports = emojis;
