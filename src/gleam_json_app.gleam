import gleam/json
import json_utils

pub fn user_to_json(user: json_utils.User) -> String {
  json.object([
    #("id", json.int(user.id)),
    #("name", json.string(user.name)),
    #("email", json.string(user.email)),
  ])
  |> json.to_string
}

pub fn main() {
  let user: json_utils.User = json_utils.User(id: 1, name: "Alice", email: "")
  let json_string = user_to_json(user)
  echo json_string
}
