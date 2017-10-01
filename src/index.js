const { layout } = require("./graph")
const { _makePathFromPoints } = require("./patterns/svg")
const svgPanZoom = require("svg-pan-zoom")
const PW = require("patternweb")
const p = require("./patterns")
const _ = require("lodash")
const _fp = require("lodash/fp")
const graph = PW.Graph();
const Β = graph.add;
const db = {};

const snabbdom = require("snabbdom");
const patch = snabbdom.init([
  require("snabbdom/modules/attributes").default,
  // require('snabbdom/modules/class').default, // makes it easy to toggle classes
  // require('snabbdom/modules/props').default, // for setting properties on DOM elements
  // require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
const h = require("snabbdom/h").default;

const container = document.getElementById("app");

function nodeRan(id) {
  console.log(`${id} just ran and stored ${JSON.stringify(db[id])}`)
}
// graph.events.on('run', nodeRan)

const dimensions = {
  width: 3000,
  height: 3000,
  roofOffset: 0,
  wallHeight: 2000,
  finWidth: 250
}


// points of graph
Β("dimensions", p.core.repeater, { IN: dimensions })

Β("getFinWidth", p.lodash.get, { OBJECT: "dimensions>OUT", PATH: "finWidth" })
Β("halfFinWidth", p.lodash.divide, { DIVIDEND: "getFinWidth>VALUE", DIVISOR: 2 })
Β("minusHalfFinWidth", p.math.flipFlop, { NUMBER: "halfFinWidth>QUOTIENT" })

Β("makeCorePoints", p.wren.makeCorePoints, { DIMENSIONS: "dimensions>OUT" })

Β("outerPoints", p.clipper.offset, { POINTS: "makeCorePoints>POINTS", DELTA: "halfFinWidth>QUOTIENT", MITER_LIMIT: 10, SCALE: 100 })
Β("mainPoints", p.clipper.offset, { POINTS: "makeCorePoints>POINTS", DELTA: 0, MITER_LIMIT: 10, SCALE: 100 })
Β("innerPoints", p.clipper.offset, { POINTS: "makeCorePoints>POINTS", DELTA: "minusHalfFinWidth>RESULT", MITER_LIMIT: 10, SCALE: 100 })

// points of graph

// fin points

Β("loopedMainPoints", p.list.loopifyInPairs, { ARRAY: "makeCorePoints>POINTS" })
Β("edgePoints", p.wren.edgePoints, {})
Β("mapEdgePoints", p.lodash.map, { COLLECTION: "makeCorePoints>POINTS", ITERATEE: "edgePoints>FN" })

// fin points

Β("log", p.core.log, { INPUT: "outerPoints>POINTS" })

Β("svg", p.snabbdom.h, { NAME: "svg", OBJECT: { attrs: { width: 200 }}, CHILDREN: "outerPath>VNODE" })

Β("pathFromOuterPoints", p.svg.makePathFromPoints, { POINTS: "outerPoints>POINTS", CLOSED: false })
Β("makeObject", p.svg.makePathFromPoints, { POINTS: "outerPoints>POINTS", CLOSED: false })

// Β("outerPath", p.snabbdom.h, { NAME: "path", "OBJECT": { attrs: { d: "pathFromOuterPoints>PATH" }} })
Β("outerPath", p.snabbdom.h, { NAME: "path", "OBJECT": "pathFromOuterPoints>PATH" })
Β("html", p.snabbdom.toHTML, { VNODE: "svg>VNODE" })

Β("log2", p.core.log, { INPUT: "html>HTML" })
// Β("save", p.fs.writeFile, { FILENAME: "output.svg", DATA: "html>HTML" })

// console.log(_.zipObjectDeep(['attrs.d'], ["something"]))
// console.log(_.concat(1))
// const wrap = item => [item];
// _fp.flow(
//   wrap,
//   _fp.zipObjectDeep(['attrs.d']),
//   console.log
// )("something")

function handleNodeClick(event, node) {
  console.log(JSON.stringify(db[node.elm.id], null, 2))
}

let portPositions = {}
const makePort = (direction, obj) => (key, x, parentX, parentY) => (port, index) => {
  const cy = 12 * index
  let _name = [key,port]
  _name = (direction === "OUT") ? _name : _name.reverse()

  obj[_name.join(">")] = [x + parentX, cy + parentY]

  const text = (direction === "OUT") ?
    h("text", { attrs: { y: cy+2, x: -5, "text-anchor": "end" }}, port) :
    h("text", { attrs: { y: cy+2, x: 5, "text-anchor": "start" }}, port)

  return [
    h("circle", { attrs: { cy, r: 3.5 }}),
    text
  ]
}
const makeInport = makePort("IN", portPositions)
const makeOutport = makePort("OUT", portPositions)

const {nodes, edges} = layout(graph)
const nodeElements = Object.keys(nodes).map(key => {
  const node = nodes[key]
  const $node = graph.find(key)

  const component = $node.component.name || "?"

  const inports = _.flatten($node.component.inports.map(makeInport(key,-node.width/2, node.x-2, node.y)))
  const outports = _.flatten($node.component.outports.map(makeOutport(key,node.width/2, node.x+2, node.y)))

  return h("g.node", { on: { click: handleNodeClick }, attrs: { id: key, transform: `translate(${node.x}, ${node.y})` }}, [
    h("rect", { attrs: { width: node.width, height: node.height, x: -node.width/2, y: -node.height/2 }}),
    h("g.inports", { attrs: { transform: `translate(${-node.width/2}, 1)` }}, inports),
    h("g.outports", { attrs: { transform: `translate(${node.width/2}, 1)` }}, outports),
    h("text.id", { attrs: { y: -20, "text-anchor": "middle" }}, key),
    h("text.component", { attrs: { y: -10, "text-anchor": "middle" }}, component)
  ])
})

function calculateJoin([startX, startY], [endX, endY]) {
  const curve = Math.abs(startX - endX) / 2;
  return [
    ["M"],
    [startX, startY],
    ["C"],
    [startX + curve, startY],
    [endX - curve, endY],
    [endX, endY]
  ]
    .map(x => x.join(","))
    .join(" ");
}

const newEdges = Object.keys(graph.edges()).map(edges => {
  return edges.split("-").map(edge => portPositions[edge])
}).map(points => calculateJoin(...points)).map(d => h("path.edge", { attrs: { d }}))

// const edgeElements = edges.map(points => h("path.oldEdge", { attrs: { d: _makePathFromPoints(points, false) }}))
// const graphData = [...edgeElements, ...nodeElements, ...newEdges]
const graphData = [...nodeElements, ...newEdges]

function render() {
  vnode = patch(vnode, view(graphData));
}
const view = data => h("svg", { attrs: { id: "svg" } }, data);
let vnode = patch(container, view(graphData));

// console.time("debug")
graph.run(db, function() {
  // console.log('done')
  // console.timeEnd("debug")
})

const panZoom = svgPanZoom("svg", {
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: true,
  center: true,
  preventMouseEventsDefault: false,
  zoomScaleSensitivity: 0.5,
  maxZoom: 2,
  minZoom: 0.4
});
