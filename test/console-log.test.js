import runTests from "./utils";

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

runTests(TEST_CASES);
