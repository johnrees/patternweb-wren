/**
 * Splits an array into groups that loop back to the first value
 * @example
 * // returns [[1,2],[2,3],[3,1]]
 * loopifyInGroups(2)([1,2,3])
 * @example
 * // returns [[1,2,3],[3,1,2]]
 * loopifyInGroups(3,1)([1,2,3])
 * @returns {Array}
 */
const loopifyInGroups = (size, offset = 0) => arr => {
  let loopedArray = [];
  for (let i = 0; i < arr.length; i++) {
    let current = i + offset * i;
    let nextItems = [];
    for (let j = 1; j < size; j++) {
      let index;
      if (current + j < arr.length) {
        index = current + j;
      } else {
        index = current + j - arr.length;
      }
      nextItems.push(arr[index]);
    }
    if (current < arr.length) {
      loopedArray.push([arr[current], ...nextItems]);
    } else {
      break;
    }
  }
  return loopedArray;
};

const loopifyInPairs = {
  fn: ({ ARRAY }, done) => done({ PAIRS: loopifyInGroups(2)(ARRAY) }),
  inports: ["ARRAY"],
  outports: ["PAIRS"]
};

module.exports = {
  loopifyInPairs
}
