const _ = require("lodash");

function _offset(points, delta, miterLimit = 10, scale = 100) {
  const paths = [points.map(pts => ({ X: pts[0] * scale, Y: pts[1] * scale }))];
  const co = new ClipperLib.ClipperOffset();
  const offsetted_paths = new ClipperLib.Paths();
  co.MiterLimit = 10;
  co.AddPaths(
    paths,
    ClipperLib.JoinType.jtMiter,
    ClipperLib.EndType.etClosedPolygon
  );
  co.Execute(offsetted_paths, delta * scale);
  return offsetted_paths[0].map(pts => [pts.X / scale, pts.Y / scale]);
}

const get = {
  fn: ({ OBJECT, PATH, DEFAULT_VALUE = undefined }, done) =>
    done({ VALUE: _.get(OBJECT, PATH, DEFAULT_VALUE) }),
  inports: ["OBJECT", "PATH", "DEFAULT_VALUE"],
  outports: ["VALUE"]
};

const divide = {
  fn: ({ DIVIDEND, DIVISOR }, done) =>
    done({ QUOTIENT: _.divide(DIVIDEND, DIVISOR) }),
  inports: ["DIVIDEND", "DIVISOR"],
  outports: ["QUOTIENT"]
};

const map = {
  fn: ({ COLLECTION, ITERATEE }, done) =>
    done({ RESULT: _.map(COLLECTION, ITERATEE) }),
  inports: ["COLLECTION", "ITERATEE"],
  outports: ["RESULT"]
};

module.exports = {
  get,
  divide,
  map
};
