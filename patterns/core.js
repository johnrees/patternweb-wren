const add = {
  name: "add",
  description: "adds values",
  fn: ({ A, B }, done) => done({ RESULT: A + B }),
  inports: ["A", "B"],
  outports: ["RESULT"]
};

const log = {
  fn: ({ INPUT }, done) => {
    console.log(INPUT)
    done({})
  },
  inports: ["INPUT"],
  outports: []
};

const repeater = {
  name: "repeater",
  description: "pushes what it receives",
  fn: ({ IN }, done) => done({ OUT: IN }),
  inports: ["IN"],
  outports: ["OUT"]
};

module.exports = {
  add,
  repeater,
  log
}
