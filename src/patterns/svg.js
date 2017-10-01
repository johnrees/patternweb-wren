function _makePathFromPoints(points, closed) {
  const start = `M${points[0]} L`;
  const middle = points
    .slice(1)
    .map(point => `${point}`)
    .join(" ");
  const end = closed ? "z" : "";
  return [start, middle, end].join("");
}

const makePathFromPoints = {
  fn: ({ POINTS, CLOSED = false }, done) =>
    done({ PATH: _makePathFromPoints(POINTS, CLOSED) }),
  inports: ["POINTS", "CLOSED"],
  outports: ["PATH"]
};

module.exports = {
  makePathFromPoints,
  _makePathFromPoints
};
