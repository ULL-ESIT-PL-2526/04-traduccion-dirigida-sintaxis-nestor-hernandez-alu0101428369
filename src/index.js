#!/usr/bin/env node
const { parse } = require("./parser.js");

if (process.argv.length > 2) {
    console.log(parse(process.argv[2]));
    process.exit(0);
}

module.exports = { parse };