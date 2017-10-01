const flipFlop = {
  fn: ({ NUMBER }, done) => done({ RESULT: NUMBER * -1 }),
  inports: ["NUMBER"],
  outports: ["RESULT"]
};

module.exports = {
  flipFlop
};
