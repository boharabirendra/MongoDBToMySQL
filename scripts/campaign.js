const fs = require("fs");
const uuid = require("uuid");
const csvWriter = require("csv-write-stream");

const Utils = require("./utils");

/**
 * Write data to campaigns, campaign_categories, and campaign_evaluators CSV files
 * @param {Array} data
 */
function writeToFile(data) {
  return new Promise((resolve, reject) => {
    try {
      const campaignWriter = csvWriter();
      const categoryWriter = csvWriter();
      const evaluatorWriter = csvWriter();

      Utils.ensureFolderExists("csv");

      campaignWriter.pipe(fs.createWriteStream("csv/campaigns.csv"));
      categoryWriter.pipe(fs.createWriteStream("csv/campaignCategories.csv"));
      evaluatorWriter.pipe(fs.createWriteStream("csv/campaignEvaluators.csv"));

      data.forEach((campaign) => {
        const campaignId = campaign._id["$oid"];

        let status = "NOT_STARTED";
        if (campaign.status === "Completed") {
          status = "COMPLETED";
        } else if (campaign.status === "Not Started") {
          status = "NOT_STARTED";
        } else if (campaign.status === "In Progress") {
          status = "IN_PROGRESS";
        }

        // Write to campaigns
        campaignWriter.write({
          id: campaignId,
          name: campaign.name,
          rewardee_message: campaign.rewardeeMessage,
          status: status,
          start_date: Utils.convertToMySQLTimestamp(
            campaign.startDate["$date"]
          ),
          end_date: Utils.convertToMySQLTimestamp(campaign.endDate["$date"]),
          number_of_rewardee: campaign.numberOfRewardee,
          number_of_appreciation: campaign.numberOfAppreciation,
          max_appreciation_per_employee: campaign.maxAppreciationPerEmployee,
          created_at: Utils.convertToMySQLTimestamp(
            campaign.createdAt["$date"]
          ),
          updated_at: Utils.convertToMySQLTimestamp(
            campaign.updatedAt["$date"]
          ),
        });

        campaign.categoryId.forEach((categoryId) => {
          categoryWriter.write({
            id: uuid.v4(),
            campaign_id: campaignId,
            category_id: categoryId["$oid"],
          });
        });

        campaign.evaluators.forEach((evaluator) => {
          evaluatorWriter.write({
            id: evaluator._id["$oid"],
            campaign_id: campaignId,
            evaluator_id: evaluator.id,
            name: evaluator.name,
            emp_id: evaluator.empId || null,
          });
        });
      });

      campaignWriter.end();
      categoryWriter.end();
      evaluatorWriter.end();

      campaignWriter.on("finish", resolve);
      categoryWriter.on("finish", resolve);
      evaluatorWriter.on("finish", resolve);

      campaignWriter.on("error", reject);
      categoryWriter.on("error", reject);
      evaluatorWriter.on("error", reject);
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

const mongoToSQLCampaigns = async (connection) => {
  const exportCampaignCMD = Utils.recordsExport("campaigns");
  await Utils.executeCMDCommand(exportCampaignCMD);
  Utils.giveReadPermission("campaigns");

  try {
    const parsedData = await Utils.parseJSONFile("campaigns");

    await writeToFile(parsedData);

    await Utils.loadDataFromCSVToMySQL(
      "csv/campaigns.csv",
      "rnr_campaigns",
      connection
    );
    await Utils.loadDataFromCSVToMySQL(
      "csv/campaignCategories.csv",
      "rnr_campaign_categories",
      connection
    );
    await Utils.loadDataFromCSVToMySQL(
      "csv/campaignEvaluators.csv",
      "rnr_campaign_evaluators",
      connection
    );

    console.log("Campaign data migration completed successfully.");
  } catch (error) {
    console.error("Error during campaign data migration:", error.message);
  }
};

module.exports = mongoToSQLCampaigns;
