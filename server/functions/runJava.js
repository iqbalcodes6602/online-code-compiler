const { v4: uuid } = require('uuid');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');

const codesDirectory = path.join(__dirname, 'codes');

async function runJava(code, input) {
    let codePath, inputPath, className;
    try {
        // Ensure the 'codes' directory exists
        await ensureDirectoryExists(codesDirectory);

        // Generate unique filenames for code and input files
        const fileName = `JAVA_Code_${uuid().replace(/-/g, '_')}`; // Replace hyphens with underscores
        codePath = path.join(codesDirectory, fileName + '.java');
        inputPath = path.join(codesDirectory, fileName + '.input');
        className = fileName; // Use the modified file name for the class name

        // Replace the class name in the code to match the generated valid file name
        const modifiedCode = code.replace(/public class \w+/g, `public class ${className}`);

        // Write the modified code and input to temporary files
        await fs.writeFile(codePath, modifiedCode);
        await fs.writeFile(inputPath, input || '');

        // Compile the Java code
        await execAsync(`javac ${codePath}`).catch((error) => {
            throw new Error(`Compilation failed: ${error.stderr || error.message}`);
        });

        // Execute the Java class with input file as input
        const startTime = new Date().getTime();
        const { error, stdout, stderr } = await execAsync(
            `java -cp ${codesDirectory} ${className} < ${inputPath}`,
            { timeout: 10000 }
        ).catch((error) => {
            if (error.killed && error.signal === 'SIGTERM') {
                throw new Error('Time limit exceeded');
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
            // Delete .class files
            if (className) {
                const classFilePath = path.join(codesDirectory, `${className}.class`);
                await attemptFileDeletion(classFilePath);
            }
        } catch (cleanupError) {
            console.error('Error cleaning up temporary files:', cleanupError);
        }
    }
}



async function ensureDirectoryExists(directoryPath) {
    try {
        await fs.access(directoryPath);
    } catch {
        await fs.mkdir(directoryPath, { recursive: true });
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
        } else if (error.code === 'ENOENT') {
            // File does not exist, no action needed
            console.warn(`File ${filePath} does not exist, skipping delete.`);
        } else {
            throw error; // Rethrow other errors
        }
    }
}

module.exports = runJava;
