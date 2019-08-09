import { generateSchema, triggerESLint } from "../src/ast";

const TRAINING = [
  {
    code: "console.log('b')",
    pass: false
  },
  {
    code: "console.log('a', 'b')",
    pass: false
  },
  {
    code: "console.log(a, c)",
    pass: false
  }
];

const TEST_CASES = [
  {
    code: "console.log('d')",
    pass: false
  },
  {
    code: "console.log(c)",
    pass: false
  },
  {
    code: "console.log('f', h)",
    pass: false
  },
  {
    code: "console.log(g, h)",
    pass: false
  },
  {
    code: "console.log('Some logs', g, h)",
    pass: false
  },
  {
    code: "console.error('Error', e)",
    pass: true
  }
];

describe("matches test cases", () => {
  const trainingCases = TRAINING.map(item => item.code);
  const schema = generateSchema(trainingCases);

  TEST_CASES.forEach(item => {
    test(`${item.code}`, () => {
      const isMatch = triggerESLint(schema, item.code);
      expect(isMatch).toBe(!item.pass);
    });
  });
});
