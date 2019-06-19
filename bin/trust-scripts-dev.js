#!/usr/bin/env node

'use strict';

const program = require('commander');

program
  .option('-p, --port <port>', '服务端口号')
  .option('-h, --host <host>', '服务主机名')
  .option('--https', '开启 https')
  .option('-c', '--cert <cert>', '关联证书文件路径，推荐 cert.pem')
  .option('-k', '--key <key>', '关联证书 key 文件路径，推荐 cert-key.pem')
  .parse(process.argv);

const DEFAULT_PORT = program.port || process.env.PORT || 7777;
const HOST = program.host || process.env.HOST || 'localhost';
const defaultPort = parseInt(DEFAULT_PORT, 10);

const dev = require('../lib/dev');

dev({ ...program, port: defaultPort, host: HOST });
