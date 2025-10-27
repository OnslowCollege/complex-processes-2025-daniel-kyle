import gleam/int
import gleam/io
import gleam/list
import gleam/string

// Types
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

// Invalid value for error tracking.
pub const invalid_value: Int = -1

// Invalid position for error tracking.
pub const invalid_position: Position = Position(invalid_value, invalid_value)

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

pub fn get_item_at(position: Position, file_system: FileSystem) -> Item {
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

// Checks if an item at a position in the
// file system is a file or not.
pub fn is_file_at(position: Position, file_system: FileSystem) -> Bool {
  let item = get_item_at(position, file_system)
  case item.is_file {
    True -> True
    False -> False
  }
}

// The complete touch command.
pub fn touch(
  current_position: Position,
  item_path: String,
  size: Int,
  file_system: FileSystem,
) -> FileSystem {
  let parent = get_item_at(current_position, file_system)
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
  let parent = get_item_at(current_position, file_system)
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

      io.debug("file_system")
      io.debug(file_system)
    }
  }
}

// Replaces the inner_list at an
// outer_index of the file system
// with a modified inner_list.
pub fn replace_inner_list(
  outer_index: Int,
  inner_list: List(Item),
  file_system: FileSystem,
) -> FileSystem {
  // The sandwich technique is used where where both
  // pieces of bread are taken away for the filling
  // to be replaced and the bread to be put back.
  let front_list = list.drop(file_system, outer_index - 1)
  let back_list = list.take(file_system, outer_index)

  let before_insertion = list.append(back_list, [inner_list])
  list.append(before_insertion, front_list)
}

pub fn get_inner_list_at(
  outer_index: Int,
  file_system: FileSystem,
) -> List(Item) {
  // Removes all inner_lists before the index
  // of our target inner_list.
  let back = list.drop(file_system, outer_index)
  io.debug(file_system)
  io.debug("Back list (get_inner_list_at)")
  io.debug(back)
  // Get's our target inner_list by taking
  // the first element of the back list.
  let target_inner_list = case list.first(back) {
    Ok(inner_list) -> inner_list
    Error(_) -> []
  }
  io.debug("target_inner_list")
  io.debug(target_inner_list)
}

pub fn get_child_file_names(
  position: Position,
  file_system: FileSystem,
) -> List(String) {
  let children_index = position.outer_index + 1
  let children_list = get_inner_list_at(children_index, file_system)
  let child_file_names =
    list.map(children_list, fn(child) {
      case child.is_file {
        True -> child.name
        False -> ""
      }
    })

  list.filter(child_file_names, fn(name) { name != "" })
  io.debug("Child file names:")
  io.debug(child_file_names)
}

pub fn get_child_folder_names(
  position: Position,
  file_system: FileSystem,
) -> List(String) {
  let children_index = position.outer_index + 1
  let children_list = get_inner_list_at(children_index, file_system)
  let child_folder_names =
    list.map(children_list, fn(child) {
      case child.is_file {
        False -> child.name
        True -> ""
      }
    })
  list.filter(child_folder_names, fn(name) { name != "" })
  io.debug("Child folder names:")
  io.debug(child_folder_names)
}

pub fn get_child_names(
  position: Position,
  file_system: FileSystem,
) -> List(String) {
  let children_index = position.outer_index + 1
  let children_list = get_inner_list_at(children_index, file_system)

  list.map(children_list, fn(child) { child.name })
}

pub fn get_item_name(item: Item) {
  item.name
}

pub fn rm(
  current_position: Position,
  path: String,
  file_system: FileSystem,
) -> FileSystem {
  case string.contains(path, "/") {
    True -> {
      let item_position = get_position(path, file_system)
      case item_position == invalid_position {
        True -> file_system
        False -> {
          let item = get_item_at(item_position, file_system)
          case item.is_file {
            True -> remove_at(item_position, file_system)
            False -> file_system
          }
        }
      }
    }
    False -> {
      // We can say this since the relative path of the file
      // from its parent directory is just it's name.
      let file_name = path

      // Outer index of the child of the folder.
      let child_outer_index = current_position.outer_index + 1
      io.debug("Child outer index: " <> int.to_string(child_outer_index))

      let inner_list = get_inner_list_at(child_outer_index, file_system)

      case in_inner_list(file_name, inner_list) {
        False -> file_system
        True -> {
          case string.contains(file_name, extension_delimiter) {
            False -> file_system
            True -> {
              // Keeps all entries in the list except the one with the
              // Name of the file we're removing.
              let modified_list =
                list.filter(inner_list, fn(item) {
                  case item.name == file_name {
                    True -> False
                    False -> True
                  }
                })

              // Outputs the final modified_list in the terminal.
              io.debug("Modified list:")
              io.debug(modified_list)

              // Finally returning the file_system with the file removed.
              replace_inner_list(child_outer_index, modified_list, file_system)
            }
          }
        }
      }
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
      let item_position = get_position(path, file_system)
      case item_position == invalid_position {
        True -> file_system
        False -> {
          let item = get_item_at(item_position, file_system)
          case item.is_file {
            False -> remove_at(item_position, file_system)
            True -> file_system
          }
        }
      }
    }
    False -> {
      // We can say this since the relative path of the file
      // from its parent directory is just it's name.
      let folder_name = path

      // Outer index of the child of the folder.
      let child_outer_index = current_position.outer_index + 1
      io.debug("Child outer index: " <> int.to_string(child_outer_index))

      let inner_list = get_inner_list_at(child_outer_index, file_system)

      case in_inner_list(folder_name, inner_list) {
        False -> file_system
        True -> {
          case string.contains(folder_name, extension_delimiter) {
            True -> file_system
            False -> {
              // Keeps all entries in the list except the one with the
              // Name of the file we're removing.
              let modified_list =
                list.filter(inner_list, fn(item) {
                  case item.name == folder_name {
                    True -> False
                    False -> True
                  }
                })

              // Outputs the final modified_list in the terminal.
              io.debug("Modified list:")
              io.debug(modified_list)

              // Finally returning the file_system with the file removed.
              replace_inner_list(child_outer_index, modified_list, file_system)
            }
          }
        }
      }
    }
  }
}

pub fn in_inner_list(name: String, inner_list: List(Item)) -> Bool {
  let valid_items =
    list.filter(inner_list, fn(current_item) { current_item.name == name })

  case list.is_empty(valid_items) {
    True -> False
    False -> True
  }
}

pub fn get_position(item_path: String, file_system: FileSystem) -> Position {
  let split_path = list.drop(string.split(item_path, "/"), 1)

  let outer_index = list.count(split_path, fn(x) { x == x }) - 1
  let name = case list.last(split_path) {
    Ok(name) -> name
    Error(_) -> ""
  }

  io.debug("From get_position, outer_index: " <> int.to_string(outer_index))

  let inner_list = get_inner_list_at(outer_index, file_system)
  io.debug("Inner List: ")
  io.debug(inner_list)

  case in_inner_list(name, inner_list) {
    // Returns an invalid position.
    False -> invalid_position
    True -> {
      let inner_index = {
        list.index_fold(inner_list, 0, fn(acc, item, idx) {
          acc
          + case item.name == name {
            True -> idx
            False -> 0
          }
        })
      }

      // Returns the position of the item.
      Position(outer_index, inner_index)
    }
  }
}

pub fn get_parent_position(item_path: String, file_system: FileSystem) {
  let split_path = string.split(item_path, "/")
  let outer_index = list.count(split_path, fn(x) { x == x }) - 1
  let name = case list.last(split_path) {
    Ok(name) -> name
    Error(_) -> ""
  }

  // The parent_outer_index is one less than the child's outer index
  // therefore we reduce the outer_index of the child by 1 to get
  // the outer index of the parent.

  let parent_outer_index = outer_index - 1

  let inner_list = get_inner_list_at(parent_outer_index, file_system)

  let inner_index = {
    list.index_fold(inner_list, 0, fn(_, item, idx) {
      case item.parent == name {
        True -> idx
        False -> 0
      }
    })
  }

  // Returns the position of the parent.
  let position = Position(parent_outer_index, inner_index)
  io.debug(position)
}

// The template file_system.
pub const starting_file_system: FileSystem = [
  [Item(name: "home", size: 5, is_file: False, parent: "")],
  [
    Item(name: "downloads", size: 5, is_file: False, parent: "home"),
    Item(name: "documents", size: 5, is_file: False, parent: "home"),
    Item(name: "music", size: 5, is_file: False, parent: "home"),
    Item(name: "photos", size: 5, is_file: False, parent: "home"),
  ],
  [
    Item(name: "japan2026", size: 5, is_file: False, parent: "photos"),
    Item(name: "passport.jpg", size: 5, is_file: True, parent: "photos"),
    Item(name: "photoid.png", size: 5, is_file: True, parent: "photos"),
    Item(name: "cv.pdf", size: 5, is_file: True, parent: "documents"),
    Item(name: "data.dat", size: 5, is_file: True, parent: "documents"),
    Item(name: "1.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "2.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "3.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "4.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "5.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "6.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "7.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "8.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "9.mp3", size: 5, is_file: True, parent: "music"),
    Item(name: "10.mp3", size: 5, is_file: True, parent: "music"),
  ],
  [
    Item(name: "tokyo.jpg", size: 5, is_file: True, parent: "japan2026"),
    Item(name: "kyoto", size: 5, is_file: True, parent: "japan2026"),
    Item(name: "miyajima.gif", size: 5, is_file: True, parent: "japan2026"),
  ],
]

// The directory we start in which is
// gonna be the root, [0,0].
pub const starting_position: Position = Position(0, 0)

// The move_up command for cd.
pub fn move_up(
  command_parameter: String,
  parent_position: Position,
  file_system: FileSystem,
) {
  case command_parameter == move_up_command {
    False -> {
      io.debug(parent_position)
      parent_position
    }
    True -> {
      let parent_outer_index = parent_position.outer_index - 1

      let item = get_item_at(parent_position, file_system)
      let new_position = case item.parent {
        // If you cannot move up nothing happens.
        "" -> parent_position
        _ -> Position(parent_outer_index, parent_position.inner_index)
      }
      io.debug(new_position)
    }
  }
}

pub fn cd(
  path: String,
  parent_position: Position,
  file_system: FileSystem,
) -> Position {
  case string.contains(path, "/") {
    True -> {
      get_position(path, file_system)
    }
    False -> {
      let outer_index = parent_position.outer_index + 1
      let inner_list = get_inner_list_at(outer_index, file_system)

      let name = path

      let inner_index = {
        list.index_fold(inner_list, 0, fn(acc, item, idx) {
          acc
          + case item.name == name {
            True -> idx
            False -> 0
          }
        })
      }

      // Return the position of the folder we want to cd into.
      let new_position = Position(outer_index, inner_index)
      let new_item = get_item_at(new_position, file_system)

      // Makes sure the item we went into is a folder.
      case new_item.is_file {
        True -> parent_position
        False -> new_position
      }
    }
  }
}
