const express = require("express");
const cors = require("cors");
const { executePy } = require("./executePy");
const { executeJS } = require("./executeJS");

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

  try {
    // Run the code and get the output
    // const { stdout, stderr } = await executePy(code, input);

    switch (language) {
      // case 'c':
      //   ({ stdout, stderr } = await executeC(code, input));
      //   break;
      // case 'cpp':
      //   ({ stdout, stderr } = await executeCpp(code, input));
      //   break;
      case 'py':
        ({ stdout, stderr } = await executePy(code, input));
        break;
      case 'js':
        ({ stdout, stderr } = await executeJS(code, input));
        break;
      // case 'java':
      //   ({ stdout, stderr } = await executeJava(code, input));
      //   break;
      default:
        return res.status(400).json({ success: false, error: "Language not supported!" });
    }

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