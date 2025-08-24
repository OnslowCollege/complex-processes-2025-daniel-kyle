import gleam/http
import gleam/int
import gleam/io
import gleam/list
import gleam/string

// import validation
import conversation
import filepath
import gleam/dict
import gleam/dynamic
import gleam/dynamic/decode
import gleam/http/request
import gleam/http/response
import gleam/httpc
import gleam/json
import gleam/result
import glen
import json_utils
import simplifile

fn thing() {
  echo "thing"
}

fn ls() {
  simplifile.get_files("./src/file_system")
}

fn touch(file_name, file_size) {
  let path = "./src/file_system/"
  let file_path = path <> file_name
  simplifile.create_file(file_path)
  simplifile.append(to: file_path, contents: file_size)
}

fn mkdir(folder_name) {
  let path = "./src/file_system/"
  let folder_path = path <> folder_name
  simplifile.create_directory(folder_path)
}

fn rm(file_name) {
  let path = "./src/file_system/"
  let file_path = path <> file_name
  simplifile.delete(file_path)
}

fn rmdir(folder_name) {
  let path = "./src/file_system/"
  let folder_path = path <> folder_name
  simplifile.delete(folder_path)
}

fn get_element(index, list) {
  let new_list = list.drop(list, index)
  case list.first(new_list) {
    Ok(element) -> element
    Error(_) -> ""
  }
}

pub fn process_command(command: String) {
  let sliced = string.split(command, " ")
  let stripped = list.filter(sliced, fn(x) { x != "" })
  let first: String = get_element(0, stripped)
  let second: String = get_element(1, stripped)
  let third: String = get_element(2, stripped)

  case first {
    "touch" -> {
      touch(second, third)
      Nil
    }
    "mkdir" -> {
      mkdir(second)
      Nil
    }
    "rm" -> {
      rm(second)
      Nil
    }
    "rmdir" -> {
      rmdir(second)
      Nil
    }
    _ -> Nil
  }
}
