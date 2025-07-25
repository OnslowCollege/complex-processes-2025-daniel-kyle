import gleam/list
import gleam/string

pub fn main() {
  echo is_valid("hello ")
}

pub fn is_valid(text: String) -> Bool {
  let char_delimiter = ""
  let chars = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9",
  ]

  let text_chars = string.split(text, char_delimiter)

  let bool_list =
    list.map(text_chars, fn(char) {
      case list.find(chars, fn(x) { x == char }) {
        Ok(_char) -> True
        Error(_char) -> False
      }
    })

  case list.find(bool_list, fn(x) { x == False }) {
    Ok(_bool) -> False
    Error(_bool) -> True
  }
}
