// executePy.js

const { v4: uuid } = require('uuid');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;

const path = require('path');
const codesDirectory = path.join(__dirname, 'codes');
async function runJava(code, input) {
    let codePath, inputPath;
    try {
        // Generate unique filenames for code and input files
        const fileName = `${uuid()}`;
        codePath = path.join(codesDirectory, fileName + '.py');
        inputPath = path.join(codesDirectory, fileName + '.input');

        // Write code and input to temporary files
        await fs.writeFile(codePath, code);
        await fs.writeFile(inputPath, input || '');

        // Execute the Python code with input file as input
        const startTime = new Date().getTime();
        const { error, stdout, stderr } = await execAsync(
            `java ${codePath} < ${inputPath}`,
            { timeout: 10000 }
        ).catch((error) => {
            if (error.killed && error.signal === 'SIGTERM') {
                throw new Error('Time limit reached');
            }
            throw error;
        });
        const endTime = new Date().getTime();

        // Calculate execution time and prepare output
        const executionTime = endTime - startTime;
        const output = error || stderr || stdout;

        return {
            data: output,
            status: true,
            executionTime: executionTime,
        };
    } catch (err) {
        return {
            data: err.message,
            status: false,
        };
    } finally {
        // Ensure to always attempt cleanup, even if an error occurred
        try {
            // Attempt to delete codePath and inputPath if they were created
            if (codePath) {
                await fs.unlink(codePath);
            }
            if (inputPath) {
                await attemptFileDeletion(inputPath);
            }
        } catch (cleanupError) {
            console.error('Error cleaning up temporary files:', cleanupError);
        }
    }
}

async function attemptFileDeletion(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        // Retry deletion after a short delay if the file is busy
        if (error.code === 'EBUSY') {
            console.warn(`File ${filePath} is busy, retrying deletion after 500ms...`);
            await new Promise((resolve) => setTimeout(resolve, 500)); // Retry after 500ms
            await fs.unlink(filePath); // Attempt deletion again
        } else {
            throw error; // Rethrow other errors
        }
    }
}

module.exports = runJava;
