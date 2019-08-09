"use strict";

var _ = require("lodash");

var parse = require("@babel/parser").parseExpression; // Utils

var isPrimitive = function isPrimitive(val) {
  return _.isNil(val) || _.isNumber(val) || _.isString(val) || _.isBoolean(val);
};

var SKIP_PROPS = ["start", "end", "loc"];

var shouldCompare = function shouldCompare(key) {
  return !SKIP_PROPS.includes(key);
};

var intersect = function intersect(nodeA, nodeB) {
  var schema = {};
  var keys = Object.keys(nodeA);
  keys.filter(shouldCompare).forEach(function(key) {
    var valA = nodeA[key];
    var valB = nodeB[key];

    if (isPrimitive(valA) && valA === valB) {
      schema[key] = valA;
      return;
    }

    if (_.isObject(valA) && !_.isEmpty(valA)) {
      schema[key] = intersect(valA, valB);
      return;
    }
  });
  return schema;
};

var matchSchema = function matchSchema(schema, node) {
  var keys = _.keys(schema);

  return keys.filter(shouldCompare).every(function(key) {
    var nodeVal = node[key];
    var schemaVal = schema[key];
    return isPrimitive(nodeVal)
      ? nodeVal === schemaVal
      : matchSchema(schemaVal, nodeVal);
  });
};

var generateSchema = function generateSchema(testCases) {
  return testCases.reduce(function(schema, test) {
    if (_.isNil(schema)) return parse(test);
    return intersect(schema, parse(test));
  }, null);
}; //

var TEST_CASES = [
  "R.merge(a, b)",
  "R.merge({ a: 1 }, c)",
  "R.merge({ b: 1 }, { c: 1 })",
  "R.merge(d, { c: 1 })"
];
var schema = generateSchema(_.slice(TEST_CASES, 0, TEST_CASES.length - 1));
console.log("------");
console.log(schema);
console.log("------");
console.log(matchSchema(schema, parse(TEST_CASES[3])));
var ast4 = parse("R.merge(a)");
console.log("------");
console.log(matchSchema(schema, ast4));
