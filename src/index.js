import { parse } from "@babel/parser";
import _ from "lodash";

const isPrimitive = val =>
  _.isNil(val) || _.isNumber(val) || _.isString(val) || _.isBoolean(val);

const shouldCompare = key => !["start", "end", "loc"].includes(key);

const intersect = (nodeA, nodeB) => {
  const schema = {};
  const keysA = Object.keys(nodeA);

  keysA.filter(shouldCompare).forEach(keyA => {
    const valA = nodeA[keyA];
    const valB = nodeB[keyA];

    if (isPrimitive(valA) && valA === valB) {
      schema[keyA] = valA;
      return;
    }

    if (_.isObject(valA) && !_.isEmpty(valA)) {
      schema[keyA] = intersect(valA, valB);
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

const getFirstStatement = node => {
  if (node.type !== "File") return node;
  return node.program.body[0];
};

const codeToAST = code => getFirstStatement(parse(code));

const generateSchema = testCases =>
  testCases.reduce((schema, test) => {
    const ast = codeToAST(test);
    if (_.isNil(schema)) return ast;
    return intersect(schema, ast);
  }, null);

const matchRuleBySchema = (schema, testCase) =>
  matchSchema(schema, codeToAST(testCase));

export { generateSchema, matchSchema, matchRuleBySchema };
