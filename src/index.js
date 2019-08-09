const _ = require("lodash");
const parse = require("@babel/parser").parseExpression;

// Utils
const isPrimitive = val =>
  _.isNil(val) || _.isNumber(val) || _.isString(val) || _.isBoolean(val);

const SKIP_PROPS = ["start", "end", "loc"];
const shouldCompare = key => !SKIP_PROPS.includes(key);

const intersect = (nodeA, nodeB) => {
  const schema = {};
  const keys = Object.keys(nodeA);

  keys.filter(shouldCompare).forEach(key => {
    const valA = nodeA[key];
    const valB = nodeB[key];

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

const matchSchema = (schema, node) => {
  const keys = _.keys(schema);
  return keys.filter(shouldCompare).every(key => {
    const nodeVal = node[key];
    const schemaVal = schema[key];
    return isPrimitive(nodeVal)
      ? nodeVal === schemaVal
      : matchSchema(schemaVal, nodeVal);
  });
};

const generateSchema = testCases =>
  testCases.reduce((schema, test) => {
    if (_.isNil(schema)) return parse(test);
    return intersect(schema, parse(test));
  }, null);

//
const TEST_CASES = [
  "R.merge(a, b)",
  "R.merge({ a: 1 }, c)",
  "R.merge({ b: 1 }, { c: 1 })",
  "R.merge(d, { c: 1 })"
];

const schema = generateSchema(_.slice(TEST_CASES, 0, TEST_CASES.length - 1));

console.log("------");
console.log(schema);

console.log("------");
console.log(matchSchema(schema, parse(TEST_CASES[3])));

const ast4 = parse("R.merge(a)");
console.log("------");
console.log(matchSchema(schema, ast4));
