const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const sanitizeError = (stderr) => {
  // Remove file path information from the error message
  return stderr.replace(/File ".*?\.py", line/g, 'Line');
};

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
    const childProcess = exec(`python ${filepath} < ${inputFilePath}`, { timeout: 5000 }, (error, stdout, stderr) => {
      // Clean up code and input files
      setTimeout(() => {
        fs.unlink(filepath, (err) => {
          if (err) console.error(`Error deleting file: ${filepath}`, err);
        });
        fs.unlink(inputFilePath, (err) => {
          if (err) console.error(`Error deleting file: ${inputFilePath}`, err);
        });
      }, 1000); // Delay for 1 second to ensure files are released by the OS

      if (error) {
        if (error.killed) {
          return reject({ error: 'Execution terminated due to timeout', stderr: 'Time limit exceeded' });
        }
        return reject({ error, stderr: sanitizeError(stderr) });
      } else if (stderr) {
        return resolve({ stdout, stderr: sanitizeError(stderr) });
      } else {
        return resolve({ stdout });
      }
    });

    // Handle timeout
    childProcess.on('error', (error) => {
      setTimeout(() => {
        fs.unlink(filepath, (err) => {
          if (err) console.error(`Error deleting file: ${filepath}`, err);
        });
        fs.unlink(inputFilePath, (err) => {
          if (err) console.error(`Error deleting file: ${inputFilePath}`, err);
        });
      }, 1000); // Delay for 1 second to ensure files are released by the OS

      reject({ error: 'Execution error', stderr: error.message });
    });
  });
};

module.exports = {
  executePy,
};