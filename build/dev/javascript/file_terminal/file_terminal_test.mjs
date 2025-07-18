import * as $gleeunit from "../gleeunit/gleeunit.mjs";
import { makeError } from "./gleam.mjs";

const FILEPATH = "test\\file_terminal_test.gleam";

export function main() {
  return $gleeunit.main();
}

export function hello_world_test() {
  let name = "Joe";
  let greeting = ("Hello, " + name) + "!";
  let $ = "Hello, Joe!";
  if (!(greeting === $)) {
    throw makeError(
      "assert",
      FILEPATH,
      "file_terminal_test",
      12,
      "hello_world_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: greeting, start: 213, end: 221 },
        right: { kind: "literal", value: $, start: 225, end: 238 },
        start: 206,
        end: 238,
        expression_start: 213
      }
    )
  }
  return undefined;
}
