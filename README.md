# asteroid

This project is a proof of concept of an algorithm to generate ESLint rules from test cases.

## Algorithm

The idea is to take examples of expressions we want to forbid in the code, compute the Abstract Syntax Tree of each one and remove the differences between the trees. This will result in a partial tree, a schema, that can be used to identify the same pattern in new expressions.

## License

MIT
