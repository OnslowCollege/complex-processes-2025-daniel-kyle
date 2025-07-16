import gleam/io
import gleam/list
import gleam/string

pub fn main() {
  io.println("Hello World")
}
// src/filesystem.gleam

pub type FileSystemNode {
  File(name: String, size: Int)
  Folder(name: String, children: List(FileSystemNode))
}
pub fn mkdir(name: String, cwd: FileSystemNode) -> FileSystemNode {
  case cwd {
    Folder(folder_name, children) -> {
      let new_folder = Folder(name, [])
      Folder(folder_name, [new_folder, ..children])
    }
    _ -> cwd
  }
}
pub fn touch(name: String, size: Int, cwd: FileSystemNode) -> FileSystemNode {
  case cwd {
    Folder(folder_name, children) -> {
      let new_file = File(name, size)
      Folder(folder_name, [new_file, ..children])
    }
    _ -> cwd
  }
}
pub fn ls(cwd: FileSystemNode) -> List(String) {
  case cwd {
    Folder(_, children) ->
      children
      |> list.map(fn(node) {
        case node {
          File(name, _) -> name
          Folder(name, _) -> name
        }
      })
    _ -> []
  }
}
// src/main.gleam

pub fn main() {
  let root = Folder("root", [])
  loop(root)
}

fn loop(cwd: FileSystemNode) {
  io.print("Enter command: ")
  case io.get_line() {
    Some(line) -> {
      let parts = string.split(line, " ")
      case parts {
        ["mkdir", name] -> {
          let new_cwd = filesystem.mkdir(name, cwd)
          loop(new_cwd)
        }
        ["touch", name, size_str] ->
          case string.to_int(size_str) {
            Ok(size) -> {
              let new_cwd = filesystem.touch(name, size, cwd)
              loop(new_cwd)
            }
            _ -> {
              io.println("Invalid size")
              loop(cwd)
            }
          }
        ["ls"] -> {
          let contents = filesystem.ls(cwd)
          contents
          |> list.map(io.println)
          loop(cwd)
        }
        ["exit"] ->
          io.println("Exiting...")
        _ ->
          io.println("Unknown command")
          loop -> cwd
      }
    }
    None -> {
      io.println("No input received")
      loop(cwd)
    }
  }
}

