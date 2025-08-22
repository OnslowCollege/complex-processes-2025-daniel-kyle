// import gleam/int
// import gleam/io
// import gleam/list
// import gleam/string
// import validation
import json_utils

// fn ls() {
//   echo "you just ls"
// }

// fn touch(file_name, file_size) {
//   echo "you just touch"
// }

// fn mkdir(folder_name) {
//   echo "you just mkdir"
// }

// fn rm(file_name) {
//   echo "you just rm"
// }

// fn rmdir(folder_name) {
//   echo "you just rmdir"
// }

// fn cd(folder) {
//   echo "you just cd"
// }

// fn get_element(index, list) {
//   let new_list = list.drop(list, index)
//   case list.first(new_list) {
//     Ok(element) -> element
//     Error(_) -> ""
//   }
// }

// pub fn process_command(command: String) {
//   let sliced = string.split(command, " ")
//   let stripped = list.filter(sliced, fn(x) { x != "" })
//   let first: String = get_element(0, stripped)
//   let second: String = get_element(1, stripped)
//   let third: String = get_element(2, stripped)

//   case first {
//     "ls" -> ls()
//     //0
//     "touch" -> touch(second, third)
//     //2
//     "mkdir" -> mkdir(second)
//     //1
//     "rm" -> rm(second)
//     //1
//     "rmdir" -> rmdir(second)
//     //1
//     "cd" -> cd(second)
//     //1
//     _ -> ""
//   }
// }

// pub fn main() {
//   process_command("hello")
// }
// // they each need a certain amount of arguments

pub fn main() {
  echo json_utils.nested_decoder()
  echo json_utils.Simple
}
