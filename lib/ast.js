"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerESLint = exports.matchSchema = exports.generateSchema = void 0;

var parse = require("@babel/parser").parseExpression;

var _ = require("lodash"); // Utils

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

exports.matchSchema = matchSchema;

var generateSchema = function generateSchema(testCases) {
  return testCases.reduce(function(schema, test) {
    if (_.isNil(schema)) return parse(test);
    return intersect(schema, parse(test));
  }, null);
};

exports.generateSchema = generateSchema;

var triggerESLint = function triggerESLint(schema, testCase) {
  var astTestCase = parse(testCase);
  return matchSchema(schema, astTestCase);
};

exports.triggerESLint = triggerESLint;
