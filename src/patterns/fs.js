const fs = require("fs");

const writeFile = {
  fn: (
    { FILENAME, DATA, ENCODING = undefined, CALLBACK = function() {} },
    done
  ) => {
    fs.writeFile(FILENAME, DATA, ENCODING, CALLBACK);
    done({});
  },
  inports: ["FILENAME", "DATA", "ENCODING", "CALLBACK"],
  outports: []
};

module.exports = {
  writeFile
};
