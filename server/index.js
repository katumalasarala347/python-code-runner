const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const getExtension = (lang) => {
  switch (lang) {
    case "python":
      return "py";
    case "javascript":
      return "js";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    case "java":
      return "java";
    default:
      return "txt";
  }
};

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const result = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language, // e.g., "python3", "javascript", "cpp", etc.
      version: "*",
      files: [{ name: `main.${getExtension(language)}`, content: code }],
      stdin: input,
    });

    res.json({ output: result.data.run.output });
  } catch (error) {
    console.error("Execution error:", error.response?.data || error.message || error);
    res.status(500).json({ output: "Error executing code." });
  }
});

app.listen(5000, () => {
  console.log("Backend server running on http://localhost:5000");
});
