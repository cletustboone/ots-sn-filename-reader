#!/usr/bin/env node

var
options = require("../lib/cli").options,
path = require("path"),
Reader = require("../lib/reader"),
readerInstance;

readerInstance = new Reader( options );
