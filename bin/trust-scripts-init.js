#!/usr/bin/env node

"use strict";

const program = require("commander");

program
  .option("-f, --folder <folder>", "初始化项目目录")
  .parse(process.argv);

const dev = require("../lib/init");

dev({ ...program });
