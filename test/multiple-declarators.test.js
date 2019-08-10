import runTests from "./utils";

const TEST_CASES = {
  training: [
    {
      code: "var a = 1, b = 2"
    },
    {
      code: "let b = 'a', c = 1, d = { a: 1 }"
    },
    {
      code: "const u = 1, v = 'c'"
    }
  ],
  invalid: [
    {
      code: "const name = 'hi', age = 45"
    },
    {
      code: "const x = 1, y = 2"
    },
    {
      code: "var p = 'a', q = 'b', r = 'c'"
    }
  ],
  valid: [
    {
      code: "const a = 1"
    },
    {
      code: "var b = 'a'"
    }
  ]
};

runTests(TEST_CASES);
