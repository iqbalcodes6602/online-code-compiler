const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const runPython = require('./functions/runPython');
const runJs = require('./functions/runJs');
const runCpp = require('./functions/runCpp');
const runJava = require('./functions/runJava');

const app = express();
const port = process.env.PORT || 5000;
const codeDir = path.join(__dirname, 'functions/codes'); // Adjust the path as per your directory structure

app.use(bodyParser.json());
app.use(cors());


// Helper function to clear the 'code' directory
async function clearCodeDirectory() {
  try {
    const files = await fs.readdir(codeDir);
    for (const file of files) {
      await fs.unlink(path.join(codeDir, file));
    }
  } catch (error) {
    throw error;
  }
}

// Route to delete all files in the 'code' directory
app.get('/clearcodes', async (req, res) => {
  try {
    await clearCodeDirectory();
    res.status(200).json({
      message: 'Successfully deleted all files in the code directory.',
      status: true,
    });
  } catch (error) {
    console.error('Error deleting files:', error);
    res.status(500).json({
      message: 'Failed to delete files in the code directory.',
      status: false,
    });
  }
});

// Route to run Python code
app.post('/runcode/python', async (req, res) => {
  try {
    const { code, input } = req.body;
    const result = await runPython(code, input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      data: error.message,
      status: false,
    });
  }
});

// Route to run Cpp code
app.post('/runcode/cpp', async (req, res) => {
  try {
    const { code, input } = req.body;
    const result = await runCpp(code, input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      data: error.message,
      status: false,
    });
  }
});

// Route to run C code
app.post('/runcode/c', async (req, res) => {
  try {
    const { code, input } = req.body;
    const result = await runCpp(code, input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      data: error.message,
      status: false,
    });
  }
});

// Route to run Java code
app.post('/runcode/java', async (req, res) => {
  try {
    const { code, input } = req.body;
    const result = await runJava(code, input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      data: error.message,
      status: false,
    });
  }
});

// Route to run JavaScript code (if needed)
app.post('/runcode/javascript', async (req, res) => {
  try {
    const { code, input } = req.body;
    // Adjust this line to run JavaScript code if implemented
    const result = await runJs(code, input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      data: error.message,
      status: false,
    });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
