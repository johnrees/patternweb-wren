const _h = require("snabbdom/h").default;
const init = require("snabbdom-to-html/init");
const attributes = require("snabbdom-to-html/modules/attributes");
const _toHTML = init([attributes]);

const h = {
  name: "Snabbdom/H",
  fn: ({ NAME, OBJECT = undefined, CHILDREN = undefined }, done) =>
    done({ VNODE: _h(NAME, OBJECT, CHILDREN) }),
  inports: ["NAME", "OBJECT", "CHILDREN"],
  outports: ["VNODE"]
};

const toHTML = {
  name: "Snabbdom/ToHTML",
  fn: ({ VNODE }, done) => done({ HTML: _toHTML(VNODE) }),
  inports: ["VNODE"],
  outports: ["HTML"]
};

module.exports = {
  h,
  toHTML
};
