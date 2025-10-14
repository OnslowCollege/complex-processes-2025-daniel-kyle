import * as itemOperations from "./build/dev/javascript/file_terminal/item_operations.mjs"

// function newElement(text) {
//     let ul = document.getElementById("contents"); // Get the <ul>
//     let li = document.createElement("li"); // Create a new <li>
//     li.textContent = text; // Set its text
//     ul.appendChild(li);
// }

// const successAudio = new Audio();
// successAudio.src = "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav"; // Path to the sound file

// const errorAudio = new Audio();
// errorAudio.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg"


// // Get's the user's input into the HTML form element after they submit.
// const commandForm = document.getElementById("command-input");
// if (commandForm) {
//     commandForm.onsubmit = function (event) {
//         event.preventDefault(); // Prevent the form from submitting
//         let commandInput = document.querySelector("input[name='command-input']").value.trim();
//         processCommand(commandInput);

//     };
// }

let fileSystem = itemOperations.starting_file_system

let currentPosition = itemOperations.starting_position

function processCommand(command) {
    let command_components = command.split(" ")
    let command_type = command_components[0]
    let file_path = command_components[1]
    let size = Number(command_components[2])
    let oldFileSystem = fileSystem
    switch (command_type) {
        case "touch":
            if (size == NaN) {
                break
            }
            fileSystem = itemOperations.touch(currentPosition, file_path, size, fileSystem)
            if (fileSystem === oldFileSystem) {
                console.log("Invalid input")
            }
            break

        case "mkdir":

            fileSystem = itemOperations.rm(itemOperations.get_position(command), fileSystem)
            if (fileSystem === oldFileSystem) {
                console.log("Invalid input")
            }
            break

        case "rm":
            command = "/home"
            
            fileSystem = itemOperations.rm(itemOperations.get_position(command), fileSystem)
            if (fileSystem === oldFileSystem) {
                console.log("Invalid input")
            }
            break

        case "rmdir":
            fileSystem = itemOperations.rmdir(itemOperations.get_position(command), fileSystem)
            if (fileSystem === oldFileSystem) {
                console.log("Invalid input")
            }
            break

        case "cd":

            currentPosition = itemOperations.move_up(file_path, currentPosition)
            
            break
        // default:
        //     console.log("You have entered an invalid command")
        //     // Play a sound on error.
        //     errorAudio.play()
            
        //     break;
    }
}
console.log(itemOperations.get_position("/home", fileSystem))
processCommand("rm")
console.log(fileSystem)