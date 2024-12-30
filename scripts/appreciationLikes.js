const fs = require('fs');
const Utils = require('./utils');
const csvWriter = require('csv-write-stream');

/**
 * Write data to appreciation_likes CSV file
 * @param {Array} data
 */
function writeToFile(data) {
  return new Promise((resolve, reject) => {
    try {
      const appreciationLikesWriter = csvWriter();

      Utils.ensureFolderExists('csv');

      appreciationLikesWriter.pipe(
        fs.createWriteStream('csv/appreciationLikes.csv'),
      );

      data.forEach((appreciationLike) => {
        appreciationLikesWriter.write({
          id: appreciationLike._id['$oid'],
          appreciator_id: appreciationLike.appreciatorId,
          campaign_id: appreciationLike.campaignId['$oid'],
          appreciation_id: appreciationLike.appreciationId['$oid'],
          created_at: Utils.convertToMySQLTimestamp(
            appreciationLike.createdAt['$date'],
          ),
          updated_at: Utils.convertToMySQLTimestamp(
            appreciationLike.updatedAt['$date'],
          ),
        });
      });

      appreciationLikesWriter.end();

      appreciationLikesWriter.on('finish', resolve);
      appreciationLikesWriter.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Load data from CSV into MySQL tables
 * @param {string} csvFile
 * @param {string} tableName
 * @param {object} connection
 */
const mongoToSQLAppreciationLikes = async (connection) => {
  const exportAppreciationLikesCMD = Utils.recordsExport('appreciationLikes');
  await Utils.executeCMDCommand(exportAppreciationLikesCMD);
  Utils.giveReadPermission('appreciationLikes');

  try {
    const parsedData = await Utils.parseJSONFile('appreciationLikes');

    await writeToFile(parsedData);

    await Utils.loadDataFromCSVToMySQL(
      'csv/appreciationLikes.csv',
      'rnr_appreciation_likes',
      connection,
    );

    console.log('Appreciation likes data migration completed successfully.');
  } catch (error) {
    console.error(
      'Error during appreciation likes data migration:',
      error.message,
    );
  }
};

module.exports = mongoToSQLAppreciationLikes;
