import gleam/string
import gleam/list

pub fn main() {
  echo is_lowercase_and_numbers("and") // true
}

fn is_lowercase_and_numbers(text: String) -> Bool {
  string.all(text, fn(char) {
    (char >= "a" && char <= "z") || (char >= "0" && char <= "9")
  })
}

