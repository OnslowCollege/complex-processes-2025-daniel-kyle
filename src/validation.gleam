import gleam/io
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string

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

pub fn has_single_extension(file_name) -> Bool {
  let split_name = string.split(file_name, "")
  let extension_count = list.count(split_name, fn(char) { char == "." })
  case extension_count == 1 {
    True -> True
    False -> False
  }
}

pub type Item {
  StrItem(String)
  IntItem(Int)
  BoolItem(Bool)
  PrtItem(String)
}

// Removed duplicate FileSystem type definition to avoid name clash
// pub type FileSystem =
//   List(List(List(Item)))

pub const default_size = 5

pub fn initialize_item(item_name, item_size, is_file, parent) {
  [StrItem(item_name), IntItem(item_size), BoolItem(is_file), PrtItem(parent)]
}

// Type definitions
pub type FileItem {
  FileItem(name: String, size: Int, is_file: Bool, parent: String)
}

pub type FileSystem =
  List(List(FileItem))

pub type Position {
  Position(level: Int, index: Int)
}

// Helper function to get element at index
fn get_at(items: List(a), index: Int) -> Result(a, Nil) {
  case index < 0 {
    True -> Error(Nil)
    False -> {
      items
      |> list.drop(index)
      |> list.first
      |> result.replace_error(Nil)
    }
  }
}

// Get position of an item in the filesystem by path
pub fn get_position(
  item_path: String,
  file_system: FileSystem,
) -> Option(Position) {
  let segmented_path =
    item_path
    |> string.split("/")
    |> list.drop(1)
  // Remove empty string from leading "/"

  let max_level = list.length(file_system) - 1

  do_get_position(segmented_path, file_system, 1, max_level)
}

fn do_get_position(
  segmented_path: List(String),
  file_system: FileSystem,
  level: Int,
  max_level: Int,
) -> Option(Position) {
  case level > max_level {
    True -> None
    False -> {
      case get_at(file_system, level) {
        Error(_) -> None
        Ok(current_level) -> {
          case find_in_level(current_level, segmented_path, level) {
            Some(index) -> {
              case level == list.length(segmented_path) - 1 {
                True -> Some(Position(level, index))
                False ->
                  do_get_position(
                    segmented_path,
                    file_system,
                    level + 1,
                    max_level,
                  )
              }
            }
            None ->
              do_get_position(segmented_path, file_system, level + 1, max_level)
          }
        }
      }
    }
  }
}

fn find_in_level(
  level: List(FileItem),
  segmented_path: List(String),
  current_level: Int,
) -> Option(Int) {
  case get_at(segmented_path, current_level - 1) {
    Error(_) -> None
    Ok(target_parent) -> {
      list.index_fold(level, None, fn(acc, item, idx) {
        case acc {
          Some(_) -> acc
          None -> {
            case item.parent == target_parent {
              True -> Some(idx)
              False -> None
            }
          }
        }
      })
    }
  }
}

// Delete item at specific position
pub fn delete_item_at(
  item_level: Int,
  item_index: Int,
  file_system: FileSystem,
) -> FileSystem {
  list.index_map(file_system, fn(level, idx) {
    case idx == item_level {
      True -> remove_at(item_index, level)
      False -> level
    }
  })
}

// Remove element at index from list
pub fn remove_at(index: Int, items: List(a)) -> List(a) {
  let before = list.take(items, index)
  let after = list.drop(items, index + 1)
  list.append(before, after)
}

// Delete folder recursively with all children
pub fn delete_folder_recursively(
  level: Int,
  index: Int,
  file_system: FileSystem,
) -> FileSystem {
  case get_at(file_system, level) {
    Error(_) -> file_system
    Ok(current_level) -> {
      case get_at(current_level, index) {
        Error(_) -> file_system
        Ok(item) -> {
          let folder_name = item.name
          let max_level = list.length(file_system) - 1

          // Delete children first
          let fs_after_children =
            delete_children(folder_name, level + 1, max_level, file_system)

          // Delete the folder itself
          delete_item_at(level, index, fs_after_children)
        }
      }
    }
  }
}

fn delete_children(
  parent_name: String,
  current_level: Int,
  max_level: Int,
  file_system: FileSystem,
) -> FileSystem {
  case current_level > max_level {
    True -> file_system
    False -> {
      case get_at(file_system, current_level) {
        Error(_) -> file_system
        Ok(level_items) -> {
          // Find all children and delete them recursively
          let fs_after_deletes =
            list.index_fold(level_items, file_system, fn(fs, item, idx) {
              case item.parent == parent_name {
                True -> delete_folder_recursively(current_level, idx, fs)
                False -> fs
              }
            })

          delete_children(
            parent_name,
            current_level + 1,
            max_level,
            fs_after_deletes,
          )
        }
      }
    }
  }
}

// Create new item in filesystem
pub fn create_item(
  level: Int,
  name: String,
  size: Int,
  is_file: Bool,
  parent: String,
  file_system: FileSystem,
) -> FileSystem {
  let new_item = FileItem(name, size, is_file, parent)

  list.index_map(file_system, fn(lvl, idx) {
    case idx == level {
      True -> list.append(lvl, [new_item])
      False -> lvl
    }
  })
}

// Get name from position
pub fn get_name_from_pos(
  level: Int,
  index: Int,
  file_system: FileSystem,
) -> Option(String) {
  case get_at(file_system, level) {
    Error(_) -> None
    Ok(level_items) -> {
      case get_at(level_items, index) {
        Error(_) -> None
        Ok(item) -> Some(item.name)
      }
    }
  }
}

// Check if filename has extension
pub fn has_extension(file_name: String) -> Bool {
  string.contains(file_name, ".")
}

fn main() {
  echo initialize_item("file.txt", 10, True, "folder")
}
