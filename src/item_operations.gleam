import gleam/io
import gleam/list
import gleam/option
import gleam/string

// This file include all constants present in the code.
pub const item_delimiter: String = "/"

// The default size of folders.
pub const default_size: Int = 5

// What separates each command in the full command.
pub const command_delimiter: String = " "

// What separates the extension from the file name.
pub const extension_delimiter: String = "."

// The base size of each file in KB.
pub const base_file_size: Int = 1

// The longest a file/folder name can be.
pub const max_name_length: Int = 12

// The shortest a file/folder name can be.
pub const min_name_length: Int = 1

// The length a file extension should be.
pub const extension_name_length: Int = 3

// An empty splitter.
pub const empty_character: String = ""

// The minimum size a file can be.
pub const min_file_size: Int = 1

// The maximum size a file can be.
pub const max_file_size: Int = 4_194_304

// Command for cd that allows the user to move up a folder.
pub const move_up_command: String = ".."

// All the validation functions for the project including checking if lengths are correct.
// It also includes the item structure itself.

fn is_false(bool: Bool) -> Bool {
  bool == False
}

// Checks if the given text contains only lowercase letters and digits.
pub fn is_alphanumeric(text: String) -> Bool {
  // Delimiter for splitting the string into characters (empty string splits into chars).
  let char_delimiter = ""
  // List of allowed characters: lowercase letters and digits
  let chars = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9",
  ]

  // Split the input text into individual characters.
  let text_chars = string.split(text, char_delimiter)

  // Map each character to True if it's allowed, False otherwise.
  let bool_list =
    list.map(text_chars, fn(char) {
      case list.find(chars, fn(x) { x == char }) {
        // Automatically returns these to the list.
        Ok(_char) -> True
        Error(_char) -> False
      }
    })

  // If any character is not allowed, return False; otherwise, return True.
  case list.find(bool_list, is_false) {
    // 
    Ok(_bool) -> False
    Error(_bool) -> True
  }
}

pub fn validate_size(file_size: Int, min: Int, max: Int) -> Bool {
  case file_size >= min {
    True ->
      case file_size <= max {
        True -> True
        False -> False
      }
    False -> False
  }
}

pub fn has_extension(file_name) -> Bool {
  let split_name = string.split(file_name, "")
  let extension_count =
    list.count(split_name, fn(char) { char == extension_delimiter })
  case extension_count == 1 {
    True -> True
    False -> False
  }
}

// Item operations

pub type Item {
  Item(name: String, size: Int, is_file: Bool, parent: String)
}

pub type InnerList =
  List(Item)

pub type FileSystem =
  List(InnerList)

pub type Position {
  Position(outer_index: Int, inner_index: Int)
}

pub fn remove_at(position: Position, file_system: FileSystem) -> FileSystem {
  // index_map applies a function to each element with access to its inner_index.
  list.index_map(file_system, fn(sublists, current_outer_index) {
    case current_outer_index == position.outer_index {
      True -> {
        let before = list.take(sublists, position.inner_index)
        let after = list.drop(sublists, position.inner_index + 1)
        list.append(before, after)
      }
      False -> sublists
    }
  })
}

// current folder must be known
// just need current folder path

// pop == drop

// has extension true

// pub fn rmdir(position: Position, file_system: FileSystem) {
//   // A pool of positions of items to delete. [inner_index, outer_inner_index]
//   let remove_pool = []
//   let target_names = []
//   let new =
//     list.index_map(
//       file_system,
//       fn(outer_list, current_outer_index) {
//         case current_outer_index >= position.outer_index {
//             True -> {
//                 list.index_map(
//                     outer_list,
//                     fn(inner_list, item) {
//                         case list.contains(item.name) {
//                             True -> {
//                             }
//                             False -> []
//                         }
//                     }
//                 )
//             }
//             _ -> [Item]
//         }
//        },
//     )
// }

pub fn initialize_item(item_name, item_size, is_file, parent) {
  Item(name: item_name, size: item_size, is_file: is_file, parent: parent)
}

pub fn insert_item_at(
  position: Position,
  item: Item,
  file_system: FileSystem,
) -> FileSystem {
  list.index_map(file_system, fn(sublists, idx) {
    case idx == position.outer_index + 1 {
      True -> list.append(sublists, [item])
      False -> sublists
    }
  })
}

// "filename" at the end. check extension to know if file or folder. size is also included check parent. if parent is a file all good, if not then exit. also validation. 
// /home/docs.exe 100

pub const null_item = Item("null", 0, True, "")

pub fn get_at(position: Position, file_system: FileSystem) -> Item {
  let before = list.drop(file_system, position.outer_index)
  let after = list.take(before, 1)
  let inner_list = case list.first(after) {
    Ok(item) -> item
    Error(_nil) -> []
  }
  let before_again = list.drop(inner_list, position.inner_index)
  let after_again = list.take(before_again, 1)
  case list.first(after_again) {
    Ok(item) -> item
    Error(_nil) -> null_item
  }
}

pub fn is_file(position: Position, file_system: FileSystem) -> Bool {
  let item = get_at(position, file_system)
  case item.is_file {
    True -> True
    False -> False
  }
}

pub fn display(position: Position, file_system: FileSystem) {
  todo
}

pub fn touch(
  current_position: Position,
  item_path: String,
  size: Int,
  file_system: FileSystem,
) -> FileSystem {
  let parent = get_at(current_position, file_system)
  case string.contains(item_path, "/") {
    False -> {
      insert_item_at(
        current_position,
        Item(item_path, size, True, parent.name),
        file_system,
      )
    }
    True -> {
      let split_path = string.split(item_path, "/")
      case list.last(split_path) {
        Ok(name) -> {
          let name_length = string.length(name)
          let parent_path = string.drop_end(item_path, name_length + 1)
          let parent_position = get_position(parent_path, file_system)
          insert_item_at(
            parent_position,
            Item(name, size, True, parent.name),
            file_system,
          )
        }
        Error(_) -> file_system
      }
    }
  }
}

// copy of touch
pub fn mkdir(
  current_position: Position,
  item_path: String,
  file_system: FileSystem,
) -> FileSystem {
  let parent = get_at(current_position, file_system)
  case string.contains(item_path, "/") {
    False -> {
      insert_item_at(
        current_position,
        Item(item_path, base_file_size, False, parent.name),
        file_system,
      )
    }
    True -> {
      let split_path = string.split(item_path, "/")
      case list.last(split_path) {
        Ok(name) -> {
          let name_length = string.length(name)
          let parent_path = string.drop_end(item_path, name_length + 1)
          let parent_position = get_position(parent_path, file_system)
          insert_item_at(
            parent_position,
            Item(name, base_file_size, False, parent.name),
            file_system,
          )
        }
        Error(_) -> file_system
      }
    }
  }
}

pub fn replace_inner_list(
  outer_index: Int,
  inner_list: List(Item),
  file_system: FileSystem,
) {
  let back_list = list.take(file_system, outer_index)
  let front_list = list.drop(file_system, outer_index - 1)
  let before_insertion = list.append(back_list, [inner_list])

  list.append(before_insertion, front_list)
}

pub fn rm(
  current_position: Position,
  path: String,
  file_system: FileSystem,
) -> FileSystem {
  case string.contains(path, "/") {
    True -> {
      let file_position = get_position(path, file_system)
      remove_at(file_position, file_system)
    }
    False -> {
      // We can say this since the relative path of the file
      // from its parent directory is just it's name.
      let file_name = path

      // 
      let modified_list_outer_index = current_position.outer_index + 1

      // 
      let before = list.drop(file_system, modified_list_outer_index)
      let after = list.take(before, 1)

      // The inner list is still a list in a list [inner_list]
      // we have to take the first element to get just the inner font.
      let inner_list = case list.first(after) {
        Ok(inner_list) -> inner_list
        Error(_) -> [null_item]
      }

      // Keeps all entries in the list except the one with the
      // name of the file we're removing.
      let modified_list =
        list.filter(inner_list, fn(item) {
          case item.name == file_name {
            True -> False
            False -> True
          }
        })
      io.debug(modified_list)

      // Finally returning the file_system with the file removed.
      replace_inner_list(modified_list_outer_index, modified_list, file_system)
    }
  }
}

pub fn rmdir(
  current_position: Position,
  path: String,
  file_system: FileSystem,
) -> FileSystem {
  case string.contains(path, "/") {
    True -> {
      let folder_position = get_position(path, file_system)
      remove_at(folder_position, file_system)
    }
    False -> {
      // We can say this since the relative path of the file
      // from its parent directory is just it's name.
      let file_name = path

      // 
      let modified_list_outer_index = current_position.outer_index + 1

      // 
      let before = list.drop(file_system, modified_list_outer_index)
      let after = list.take(before, 1)

      // The inner list is still a list in a list [inner_list]
      // we have to take the first element to get just the inner font.
      let inner_list = case list.first(after) {
        Ok(inner_list) -> inner_list
        Error(_) -> [null_item]
      }

      // Keeps all entries in the list except the one with the
      // name of the file we're removing.
      let modified_list =
        list.filter(inner_list, fn(item) {
          case item.name == file_name {
            True -> False
            False -> True
          }
        })
      io.debug(modified_list)

      // Finally returning the file_system with the file removed.
      replace_inner_list(modified_list_outer_index, modified_list, file_system)
    }
  }
}

pub fn get_position(item_path: String, file_system: FileSystem) {
  let split_path = list.drop(string.split(item_path, "/"), 1)

  let outer_index = list.count(split_path, fn(x) { x == x }) - 1
  let name = case list.last(split_path) {
    Ok(name) -> name
    Error(_) -> ""
  }

  let before = list.drop(file_system, outer_index)
  let after = list.take(before, 1)

  let inner_list = case list.first(after) {
    Ok(inner_list) -> inner_list
    Error(_) -> []
  }
  let inner_index = {
    list.index_fold(inner_list, 0, fn(_, item, idx) {
      case item.name == name {
        True -> idx
        False -> 0
      }
    })
  }

  Position(outer_index, inner_index)
}

pub fn get_parent_position(item_path: String, file_system: FileSystem) {
  let split_path = string.split(item_path, "/")
  let outer_index = list.count(split_path, fn(x) { x == x }) - 1
  let name = case list.last(split_path) {
    Ok(name) -> name
    Error(_) -> ""
  }

  let before = list.drop(file_system, outer_index - 1)
  let after = list.take(before, 1)
  let inner_list = case list.first(after) {
    Ok(inner_list) -> inner_list
    Error(_) -> []
  }

  let inner_index = {
    list.index_fold(inner_list, 0, fn(_, item, idx) {
      case item.parent == name {
        True -> idx
        False -> 0
      }
    })
  }

  Position(outer_index, inner_index)
}

pub const starting_file_system: FileSystem = [
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

pub const starting_position: Position = Position(0, 0)

pub fn move_up(
  command: String,
  current_position: Position,
  file_system: FileSystem,
) {
  case command == move_up_command {
    False -> current_position
    True -> {
      let item = get_at(current_position, file_system)
      case item.parent {
        "" -> current_position
        _ ->
          Position(
            current_position.outer_index - 1,
            current_position.inner_index,
          )
      }
    }
  }
}

pub fn cd(position: Position, path: String, file_system: FileSystem) {
  case string.contains(path, "/") {
    True -> {
      get_position(path, file_system)
    }
    False -> Position(1, 1)
  }
}
