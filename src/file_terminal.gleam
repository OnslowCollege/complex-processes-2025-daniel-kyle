import gleam/list
import gleam/string

// Checks if the given text contains only lowercase letters and digits
pub fn is_valid(text: String) -> Bool {
  // Delimiter for splitting the string into characters (empty string splits into chars)
  let char_delimiter = ""
  // List of allowed characters: lowercase letters and digits
  let chars = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9",
  ]

  // Split the input text into individual characters
  let text_chars = string.split(text, char_delimiter)

  // Map each character to True if it's allowed, False otherwise
  let bool_list =
    list.map(text_chars, fn(char) {
      case list.find(chars, fn(x) { x == char }) {
        Ok(_char) -> True
        Error(_char) -> False
      }
    })

  // If any character is not allowed, return False; otherwise, return True
  case list.find(bool_list, fn(x) { x == False }) {
    Ok(_bool) -> False
    Error(_bool) -> True
  }
}

// Entry point for the program
pub fn main() {
  let text = "hello123"
  let result = is_valid(text)
  echo result
}

