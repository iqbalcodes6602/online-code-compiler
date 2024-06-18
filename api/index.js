const express = require("express");
const cors = require("cors");
const { executePy } = require("./executePy");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ hello: "world!" });
});

app.post("/run", async (req, res) => {
  const { language = "py", code, input = "" } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  if (language !== "py") {
    return res.status(400).json({ success: false, error: "Only Python is supported!" });
  }

  try {
    // Run the code and get the output
    const { stdout, stderr } = await executePy(code, input);

    // Send the response back
    return res.json({ stdout, stderr });
  } catch (err) {
    console.log(err)
    if (err.stderr)
      return res.status(500).json({ success: false, error: err.stderr });
    return res.status(500).json({ success: false, error: err.error.code });
  }
});

app.listen(5000, () => {
  console.log(`Listening on port 5000!`);
});