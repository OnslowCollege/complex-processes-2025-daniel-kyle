import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import { Ok, toList } from "./gleam.mjs";

export function is_valid(text) {
  let char_delimiter = "";
  let chars = toList([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ]);
  let text_chars = $string.split(text, char_delimiter);
  let bool_list = $list.map(
    text_chars,
    (char) => {
      let $ = $list.find(chars, (x) => { return x === char; });
      if ($ instanceof Ok) {
        return true;
      } else {
        return false;
      }
    },
  );
  let $ = $list.find(bool_list, (x) => { return x === false; });
  if ($ instanceof Ok) {
    return false;
  } else {
    return true;
  }
}
