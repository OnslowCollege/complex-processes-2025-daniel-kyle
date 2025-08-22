import gleam/dict
import gleam/dynamic
import gleam/dynamic/decode
import gleam/int
import gleam/json
import gleam/string

pub type Item {
  Item(List(Item))
  Name(String)
  Size(Int)
  Isfile(Bool)
}

pub type Simple {
  Simple(name: String)
}

// pub fn decoder(json_file) -> decode.Decoder(Item) {
//     use name <- decode.field("name", string)
//     use size <- decode.field("size", int)
//     use is_file <- decode.field("is_file", bool)
//     echo name
//     echo size
//     echo is_file

// }

pub fn nested_decoder() -> decode.Decoder(Item) {
  use <- decode.recursive
  {
    decode.one_of(decode.string |> decode.map(Name), [
      decode.list(nested_decoder()) |> decode.map(Item),
    ])
  }
}
