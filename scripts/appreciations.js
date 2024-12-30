const fs = require('fs');
const uuid = require('uuid');
const csvWriter = require('csv-write-stream');

const Utils = require('./utils');

/**
 * Write appreciation data to CSV files
 * @param {Array} data
 */
function writeAppreciationDataToFile(data) {
  return new Promise((resolve, reject) => {
    try {
      const appreciationWriter = csvWriter();
      const totalCountsWriter = csvWriter();
      const detailsWriter = csvWriter();

      Utils.ensureFolderExists('csv');

      appreciationWriter.pipe(fs.createWriteStream('csv/appreciations.csv'));
      totalCountsWriter.pipe(
        fs.createWriteStream('csv/appreciationTotalCounts.csv'),
      );
      detailsWriter.pipe(fs.createWriteStream('csv/appreciationDetails.csv'));

      data.forEach((appreciation) => {
        const appreciationId = appreciation._id['$oid'];

        appreciationWriter.write({
          id: appreciationId,
          appraisee_name: appreciation.appraisee.name,
          appraisee_id: appreciation.appraisee.id,
          appraisee_emp_id: appreciation.appraisee.empId || null,
          appraisee_department: appreciation.appraisee.department,
          appraisee_designation: appreciation.appraisee.designation,
          campaign_id: appreciation.campaignId
            ? appreciation.campaignId['$oid']
            : null,
          total_weight_vote: appreciation.totalWeightVote || 0,
          nominated_by: appreciation.nominated?.by || null,
          nominated_date: appreciation.nominated?.date
            ? Utils.convertToMySQLTimestamp(
                appreciation.nominated.date['$date'],
              )
            : null,
          nominated_status: appreciation.nominated?.status ? 1 : 0,
          created_at: Utils.convertToMySQLTimestamp(
            appreciation.createdAt['$date'],
          ),
          updated_at: Utils.convertToMySQLTimestamp(
            appreciation.updatedAt['$date'],
          ),
        });

        appreciation.totalCount.forEach((count) => {
          totalCountsWriter.write({
            id: uuid.v4(),
            appreciation_id: appreciationId,
            count: count.count,
            appreciation_type_weight: count.appreciationTypeWeight,
            appreciation_type_id: count.appreciationTypeId['$oid'],
          });
        });

        appreciation.appreciatedBy.forEach((detail) => {
          detailsWriter.write({
            id: uuid.v4(),
            appreciation_id: appreciationId,
            comment: detail.comment,
            detail_id: detail.id,
            name: detail.name,
            emp_id: detail.empId || null,
            department: detail.department,
            designation: detail.designation,
            category_id: detail.categoryId ? detail.categoryId['$oid'] : null,
            appreciation_type_id: detail.appreciationTypeId
              ? detail.appreciationTypeId['$oid']
              : null,
          });
        });
      });

      appreciationWriter.end();
      totalCountsWriter.end();
      detailsWriter.end();

      appreciationWriter.on('finish', resolve);
      totalCountsWriter.on('finish', resolve);
      detailsWriter.on('finish', resolve);

      appreciationWriter.on('error', reject);
      totalCountsWriter.on('error', reject);
      detailsWriter.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Load appreciation data from MongoDB to MySQL
 * @param {object} connection
 */
const mongoToSQLAppreciations = async (connection) => {
  const exportAppreciationCMD = Utils.recordsExport('appreciations');
  await Utils.executeCMDCommand(exportAppreciationCMD);
  Utils.giveReadPermission('appreciations');

  try {
    const parsedData = await Utils.parseJSONFile('appreciations');

    await writeAppreciationDataToFile(parsedData);

    await Utils.loadDataFromCSVToMySQL(
      'csv/appreciations.csv',
      'rnr_appreciations',
      connection,
    );
    await Utils.loadDataFromCSVToMySQL(
      'csv/appreciationTotalCounts.csv',
      'rnr_appreciation_total_counts',
      connection,
    );
    await Utils.loadDataFromCSVToMySQL(
      'csv/appreciationDetails.csv',
      'rnr_appreciation_details',
      connection,
    );

    console.log('Appreciation data migration completed successfully.');
  } catch (error) {
    console.error('Error during appreciation data migration:', error.message);
  }
};

module.exports = mongoToSQLAppreciations;
