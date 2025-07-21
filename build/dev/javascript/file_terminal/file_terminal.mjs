import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";

export function is_capital_letter(char) {
  let uppercase_char = $string.uppercase(char);
  return $string.contains(uppercase_char, char);
}

export function main() {
  return $io.println("A");
}
