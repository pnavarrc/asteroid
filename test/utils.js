import { generateSchema, matchRuleBySchema } from "../src";

const runTests = ({ training, invalid, valid }) => {
  const trainingCases = training.map(({ code }) => code);
  const schema = generateSchema(trainingCases);

  describe("rule is triggered by invalid cases", () => {
    invalid.forEach(({ code }) => {
      test(code, () => {
        const matchRule = matchRuleBySchema(schema, code);
        expect(matchRule).toBe(true);
      });
    });
  });

  describe("rule is not triggered by valid cases", () => {
    valid.forEach(({ code }) => {
      test(code, () => {
        const matchRule = matchRuleBySchema(schema, code);
        expect(matchRule).toBe(false);
      });
    });
  });
};

export default runTests;
