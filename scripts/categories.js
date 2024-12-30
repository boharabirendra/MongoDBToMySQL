const fs = require('fs');
const csvWriter = require('csv-write-stream');

const Utils = require('./utils');

/**
 * Generate mongoexport command for a collection
 *
 * @param {string} collectionName
 * @returns string
 */

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
          name: row.name,
          description: row.description,
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
 * Load data into MySQL table from CSV file
 * @param {string} csvFile
 * @param {string} tableName
 */

const mongoToSQLCategories = async (connection) => {
  const exportCategoriesCMDCommand = Utils.recordsExport('categories');

  await Utils.executeCMDCommand(exportCategoriesCMDCommand);
  Utils.giveReadPermission('categories');

  try {
    const parsedData = await Utils.parseJSONFile('categories');
    await writeToFile('categories', parsedData);
    await Utils.loadDataFromCSVToMySQL(
      'csv/categories.csv',
      'rnr_categories',
      connection,
    );
  } catch (error) {
    console.error('Error parsing JSON file:', error.message);
  }
};

module.exports = mongoToSQLCategories;
