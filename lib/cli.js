var
nopt = require("nopt");

exports.known = {
  "file": [String, null],
  "in0": [Boolean],
  "out0": [Boolean]
};

exports.shortHands = {
  "n0": ["--in0"],
  "o0": ["--out0"]
};

exports.options = nopt( exports.known, exports.shortHands, process.argv, 2 );