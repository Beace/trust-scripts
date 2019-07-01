#!/usr/bin/env node

'use strict';

const program = require('commander');

program
  .option("--analyzer", "开启 webpack bundle analyzer 插件")
  .parse(process.argv);

const build = require('../lib/build');

build(program);
