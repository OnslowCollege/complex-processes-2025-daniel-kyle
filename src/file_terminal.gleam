<<<<<<< HEAD
import gleam/io
import gleam/string
pub fn is_capital_letter(char: String) -> Bool {
    let uppercase_char = string.uppercase(char)
    string.contains(uppercase_char, char)
}

pub fn main() {
  io.println(is_capital_letter("A")) // Should print true  
}
=======

>>>>>>> 4b930057510e61e180a8df12510c46a68b830766
