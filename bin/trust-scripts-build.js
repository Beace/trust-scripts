#!/usr/bin/env node

'use strict';

const program = require('commander');

// TODO: 这些参数其实在生产环境不需要，暂时直接复制过来
program
  .option('-p, --port <port>', '服务端口号')
  .option('-h, --host <host>', '服务主机名')
  .option('--https', '开启 https')
  .option('-c', '--cert <cert>', '关联证书文件路径，推荐 cert.pem')
  .option('-k', '--key <key>', '关联证书 key 文件路径，推荐 cert-key.pem')
  .parse(process.argv);

const build = require('../lib/build');

build();
