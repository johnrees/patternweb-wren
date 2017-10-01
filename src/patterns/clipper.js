const ClipperLib = require("clipper-lib");

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

const offset = {
  fn: ({ POINTS, DELTA, MITER_LIMIT, SCALE }, done) =>
    done({ POINTS: _offset(POINTS, DELTA, MITER_LIMIT, SCALE) }),
  inports: ["POINTS", "DELTA", "SCALE"],
  outports: ["POINTS"]
};

module.exports = {
  offset
};
