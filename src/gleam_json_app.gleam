// import gleam/dynamic/decode
// import gleam/json
// import json_utils

// pub fn user_to_json(item: json_utils.Item) -> String {
//   json.object([
//     #("name", json.string(item.name)),
//     #("size", json.int(item.size)),
//     #("is_file", json.bool(item.is_file)),
//   ])
//   |> json.to_string
// }

// pub fn main() {
//   let user: json_utils.Item =
//     json_utils.Item(name: "home", size: 1, is_file: False)
//   let json_string = user_to_json(user)
//   echo json_string
// }
