const fs = require('fs');
const csvWriter = require('csv-write-stream');

const Utils = require('./utils');

/**
 * Write appreciation type data to a CSV file
 * @param {Array} data
 */
function writeToFile(data) {
  return new Promise((resolve, reject) => {
    try {
      const writer = csvWriter();

      Utils.ensureFolderExists('csv');

      writer.pipe(fs.createWriteStream('csv/appreciationTypes.csv'));

      data.forEach((type) => {
        writer.write({
          id: type._id['$oid'],
          name: type.name,
          abbreviation: type.abbreviation,
          value: type.value,
        });
      });

      writer.end();

      writer.on('finish', resolve);
      writer.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Load appreciation type data from MongoDB to MySQL
 * @param {object} connection
 */
const mongoToSQLAppreciationTypes = async (connection) => {
  const exportAppreciationTypesCMD = Utils.recordsExport('appreciationTypes');
  await Utils.executeCMDCommand(exportAppreciationTypesCMD);
  Utils.giveReadPermission('appreciationTypes');

  try {
    const parsedData = await Utils.parseJSONFile('appreciationTypes');

    await writeToFile(parsedData);

    await Utils.loadDataFromCSVToMySQL(
      'csv/appreciationTypes.csv',
      'rnr_appreciation_types',
      connection,
    );

    console.log('Appreciation types data migration completed successfully.');
  } catch (error) {
    console.error(
      'Error during appreciation types data migration:',
      error.message,
    );
  }
};

module.exports = mongoToSQLAppreciationTypes;
