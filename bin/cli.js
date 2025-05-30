#!/usr/bin/env node

/*****************************************************************
 * TypeScript Express Starter - ts-noahdev0
 * 2025.05.30 ~ 🎮
 * Made By noahdev0 🦖
 * https://github.com/noahdev0/ts-noahdev0
 *****************************************************************/

const path = require("path");
const starter = require("../lib/starter");
const destination = getDest(process.argv[2]);

function getDest(destFolder = "ts-noahdev0-project") {
  return path.join(process.cwd(), destFolder);
}

starter(destination).catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
