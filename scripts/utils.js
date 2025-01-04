const fs = require("fs");
const csv = require("csv-parser");
const readline = require("readline");
const { exec } = require("child_process");

const { mongoSecrets } = require("./config");

function recordsExport(collectionName) {
  return `mongoexport --uri="mongodb+srv://${mongoSecrets.USER}:${mongoSecrets.PASSWORD}@${mongoSecrets.HOST}/${mongoSecrets.DATABASE}" --authenticationDatabase=admin --db=${mongoSecrets.DATABASE} --collection=${collectionName} --out=json/${collectionName}.json`;
}

/**
 * Give read permission to file name
 *
 * @param {string} collectionName
 */

function giveReadPermission(collectionName) {
  exec(`chmod +r json/${collectionName}.json`);
}

/**
 * Executes a shell command and resolves when the command completes.
 *
 * @param {string} CMDCommand
 * @returns {Promise<string>}
 */
async function executeCMDCommand(CMDCommand) {
  return new Promise((resolve, reject) => {
    exec(CMDCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Standard error: ${stderr}`);
        resolve(stderr);
        return;
      }
      console.log(`Command output: ${stdout}`);
      resolve(stdout);
    });
  });
}

/**
 *
 * @param {string} fileName
 * @returns {Promise<Array>}
 */
function parseJSONFile(fileName) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(`json/${fileName}.json`);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const parsedDataArray = [];

    rl.on("line", (line) => {
      try {
        const parsedObject = JSON.parse(line);
        parsedDataArray.push(parsedObject);
      } catch (error) {
        console.error("Error parsing line:", line, error.message);
      }
    });

    rl.on("close", () => {
      resolve(parsedDataArray);
    });

    rl.on("error", (error) => {
      reject(error);
    });
  });
}

async function loadDataFromCSVToMySQL(csvFile, tableName, connection) {
  try {
    await connection.query(`DELETE FROM ${tableName};`);
    console.log(`Cleared existing data in ${tableName}.`);

    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFile)
        .pipe(csv())
        .on("data", (row) => {
          const processedRow = Object.values(row).map((value) =>
            value === "" ? null : value
          );
          results.push(processedRow);
        })
        .on("end", async () => {
          try {
            console.log(`Processing data for ${tableName}...`);
            await connection.query(`INSERT INTO ${tableName} VALUES ?`, [
              results,
            ]);
            console.log(`Data successfully loaded into ${tableName}`);
            resolve();
          } catch (error) {
            console.error(
              `Error loading data into ${tableName}:`,
              error.message
            );
            reject(error);
          }
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  } catch (error) {
    console.error(`Error loading data into ${tableName}:`, error.message);
  }
}

function convertToMySQLTimestamp(isoString) {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

module.exports = {
  recordsExport,
  parseJSONFile,
  executeCMDCommand,
  ensureFolderExists,
  giveReadPermission,
  loadDataFromCSVToMySQL,
  convertToMySQLTimestamp,
};
