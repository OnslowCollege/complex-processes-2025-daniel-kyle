import gleam/dynamic/decode
import gleam/json

pub type User {
  User(id: Int, name: String, email: String)
}

pub fn user_from_json(json_string: String) -> Result(User, json.DecodeError) {
  let user_decoder = {
    use id <- decode.field("id", decode.int)
    use name <- decode.field("name", decode.string)
    use email <- decode.field("email", decode.string)
    decode.success(User(id: id, name: name, email: email))
  }
  json.parse(from: json_string, using: user_decoder)
}
