import { generateSchema, matchRuleBySchema } from "../src/ast";

const TEST_CASES = {
  training: [
    {
      code: "console.log('a')"
    },
    {
      code: "console.log('b', 'c')"
    },
    {
      code: "console.log(c, d)"
    }
  ],
  invalid: [
    {
      code: "console.log('d')"
    },
    {
      code: "console.log(c)"
    },
    {
      code: "console.log('f', h)"
    },
    {
      code: "console.log(g, h)"
    },
    {
      code: "console.log('Some logs', g, h)"
    }
  ],
  valid: [
    {
      code: "console.error('Error', e)"
    },
    {
      code: "console.warn('Warning')"
    }
  ]
};

const trainingCases = TEST_CASES.training.map(({ code }) => code);
const schema = generateSchema(trainingCases);

describe("rule is triggered by invalid cases", () => {
  TEST_CASES.invalid.forEach(({ code }) => {
    test(code, () => {
      const matchRule = matchRuleBySchema(schema, code);
      expect(matchRule).toBe(true);
    });
  });
});

describe("rule is not triggered by valid cases", () => {
  TEST_CASES.valid.forEach(({ code }) => {
    test(code, () => {
      const matchRule = matchRuleBySchema(schema, code);
      expect(matchRule).toBe(false);
    });
  });
});
