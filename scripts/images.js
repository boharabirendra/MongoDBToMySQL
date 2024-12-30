// images
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
          url: row.url,
          active: row.active === true ? 1 : 0,
          created_at: Utils.convertToMySQLTimestamp(row.createdAt[`$date`]),
          updated_at: Utils.convertToMySQLTimestamp(row.updatedAt[`$date`]),
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

async function images(connection) {
  const mongoexportCommand = Utils.recordsExport('images');
  await Utils.executeCMDCommand(mongoexportCommand);
  Utils.giveReadPermission('images');
  const imagesParsedData = await Utils.parseJSONFile('images');
  try {
    await writeToFile('images', imagesParsedData);
    await Utils.loadDataFromCSVToMySQL(
      'csv/images.csv',
      'rnr_images',
      connection,
    );
  } catch (error) {
    console.error('Error => ', error);
  }
}

module.exports = images;
