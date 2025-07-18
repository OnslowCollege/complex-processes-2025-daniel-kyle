import gleam/io
import gleam/result

pub fn main() {
  let _ = case without_use() {
    Ok(msg) -> io.print(msg)
    Error(_) -> io.print("Login failed\n")
  }

  let _ = case with_use() {
    Ok(msg) -> io.print(msg)
    Error(_) -> io.print("Login failed\n")
  }
}

pub fn without_use() -> Result(String, Nil) {
  result.try(get_username(), fn(username) {
    result.try(get_password(), fn(password) {
      result.map(log_in(username, password), fn(greeting) {
        greeting <> ", " <> username <> "\n"
      })
    })
  })
}

pub fn with_use() -> Result(String, Nil) {
  result.try(get_username(), fn(username) {
    result.try(get_password(), fn(password) {
      result.map(log_in(username, password), fn(greeting) {
        greeting <> ", " <> username <> "\n"
      })
    })
  })
}

// Simulated login functions

fn get_username() -> Result(String, Nil) {
  Ok("kyle")
}

fn get_password() -> Result(String, Nil) {
  Ok("hunter2")
}

fn log_in(_username: String, _password: String) -> Result(String, Nil) {
  Ok("Fuck off")
}
