const tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");

const filePath = tl.getInput("filePath", true);
const placeholderDelimiter = tl.getInput("placeholderDelimiter", true);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const placeholderRegex = new RegExp(
  `${escapeRegex(placeholderDelimiter)}(.*?)${escapeRegex(placeholderDelimiter)}`,
  "g"
);

const replaceRegex = new RegExp(`${escapeRegex(placeholderDelimiter)}`, "g");

async function run() {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    const matches = [...content.matchAll(placeholderRegex)].map((m) => m[0]);
    const uniqueMatches = [...new Set(matches)];

    uniqueMatches.forEach((match) => {
      const envKey = match.replace(replaceRegex, "");
      const envValue = tl.getVariable(envKey);
      if (envValue !== undefined) {
        content = content.replaceAll(match, envValue);
      } else {
        tl.warning(`⚠️ Environment variable ${envKey} not found. Placeholder ${match} left as is.`);
      }
    });

    fs.writeFileSync(filePath, content, "utf8");
    tl.setResult(tl.TaskResult.Succeeded, "Environment variables replaced successfully.");
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
