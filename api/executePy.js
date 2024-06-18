const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const executePy = (code, input) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const filename = `${jobId}.py`;
    const filepath = path.join(dirCodes, filename);
    const inputFilePath = `${filepath}.input`;

    // Write the code and input to files
    fs.writeFileSync(filepath, code);
    fs.writeFileSync(inputFilePath, input);

    // Execute the Python file with the input
    exec(`python ${filepath} < ${inputFilePath}`, (error, stdout, stderr) => {
      // Clean up code and input files
      fs.unlinkSync(filepath);
      fs.unlinkSync(inputFilePath);

      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = {
  executePy,
};
