import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import { Ok } from "./gleam.mjs";

function get_username() {
  return new Ok("kyle");
}

function get_password() {
  return new Ok("hunter2");
}

function log_in(_, _1) {
  return new Ok("Fuck off");
}

export function without_use() {
  return $result.try$(
    get_username(),
    (username) => {
      return $result.try$(
        get_password(),
        (password) => {
          return $result.map(
            log_in(username, password),
            (greeting) => { return ((greeting + ", ") + username) + "\n"; },
          );
        },
      );
    },
  );
}

export function with_use() {
  return $result.try$(
    get_username(),
    (username) => {
      return $result.try$(
        get_password(),
        (password) => {
          return $result.map(
            log_in(username, password),
            (greeting) => { return ((greeting + ", ") + username) + "\n"; },
          );
        },
      );
    },
  );
}

export function main() {
  let _block;
  let $1 = without_use();
  if ($1 instanceof Ok) {
    let msg = $1[0];
    _block = $io.print(msg);
  } else {
    _block = $io.print("Login failed\n");
  }
  let $ = _block;
  
  let _block$1;
  let $3 = with_use();
  if ($3 instanceof Ok) {
    let msg = $3[0];
    _block$1 = $io.print(msg);
  } else {
    _block$1 = $io.print("Login failed\n");
  }
  let $2 = _block$1;
  
  return $2;
}
