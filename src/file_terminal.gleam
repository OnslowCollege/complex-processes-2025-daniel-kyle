import gleam/io
import gleam/list

import item_operations.{
  type FileSystem, type InnerList, Item, Position, get_position, remove_at,
}

// pub fn main() {
//   let file_system = [
//     [
//       Item(name: "hello.txt", size: 5, is_file: True, parent: "home"),
//       Item(name: "excess", size: 5, is_file: False, parent: "home"),
//     ],
//     [
//       Item(name: "helloyou.txt", size: 5, is_file: True, parent: "excess"),
//       Item(name: "helloagain.txt", size: 5, is_file: True, parent: "excess"),
//     ],
//   ]

//   let new_big_numbers = remove_at(Position(1, 0), file_system)

//   io.debug(new_big_numbers)
// }

// pub fn main() {
//   let big_numbers = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 10], [9, 5, 4]]]

//   // Insert [99, 100, 101] into the second outer list (i1 = 1) at position i2 = 1
//   let new_big_numbers = insert_sublist_at(big_numbers, 1, 1, [99, 100, 101])

//   io.debug(new_big_numbers)
// }

pub fn main() {
  let file_system = [
    [Item(name: "home", size: 5, is_file: False, parent: "")],
    [
      Item(name: "hello.txt", size: 5, is_file: True, parent: "home"),
      Item(name: "excess", size: 5, is_file: False, parent: "home"),
    ],
    [
      Item(name: "helloyou.txt", size: 5, is_file: True, parent: "excess"),
      Item(name: "helloagain.txt", size: 5, is_file: True, parent: "excess"),
    ],
  ]
  // let new_file_system =
  //   insert_sublist_at(
  //     Position(1, 0),
  //     Item(name: "hellous.txt", size: 5, is_file: True, parent: "excess"),
  //     file_system,
  //   )
  io.debug(item_operations.rm(Position(0, 0), "hello.txt", file_system))
}
