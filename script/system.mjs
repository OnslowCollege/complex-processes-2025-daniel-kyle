// This is the new backend for the project.

// Imports from gleam.
import * as itemOperations from "../build/dev/javascript/file_terminal/item_operations.mjs"
import { string } from "../build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs"

function newElement(text) {
    let ul = document.getElementById("contents"); // Get the <ul>
    let li = document.createElement("li"); // Create a new <li>
    li.textContent = text; // Set its text
    ul.appendChild(li);
}

const successAudio = new Audio();
// Path to the sound file
successAudio.src = "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav"; 

const errorAudio = new Audio();
errorAudio.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg"


// Get's the user's input into the HTML form element after they submit.
const commandForm = document.getElementById("command-input");
if (commandForm) {
    commandForm.onsubmit = function (event) {
        event.preventDefault(); // Prevent the form from submitting
        let commandInput = document.querySelector("input[name='command-input']").value.trim();
        processCommand(commandInput);

    };
}

// Mutable file system with the template imported from gleam.
// Has to be imported from gleam as javascript can only store
// mutable data and gleam cannot since it's functional.
let fileSystem = itemOperations.starting_file_system
// The root position is imported from gleam as a 
// Position type which is similar to an object.
// The root position as a list would be [0,0] by default.
let currentPosition = itemOperations.starting_position

function displayChildren(position) {
    // The default number of spaces betwen the file/folder name and it's details.
    const defaultSpaces = 25;
    // The spacing characters seperating the file/folder name and it's details.
    const spacer = " ";
    document.getElementById("contents").innerHTML = ""; // Clear the list
    for (let child_name of itemOperations.get_child_names(position, fileSystem)) {
        // Makes the prefix 'dir' if the child is a folder.
        // The spaces between the file/folder name and the details.
        let spaces = defaultSpaces - child_name.length - 1;
        // The spacing between the file/folder name and the details.
        let spacing = spacer.repeat(spaces);
        // The name of the file/folder and it's details
        newElement(`/${child_name}${spacing}`);
    }

}
displayChildren(currentPosition);

let currentFolderName = itemOperations.get_item_name(itemOperations.get_item_at(currentPosition))
document.getElementById("directory").innerHTML = currentFolderName;
console.log("Current folder name: ", currentFolderName)
/**
 * 
 * @param full_command - The full string command the user inputs into the website.
 * This command contains the command_type (touch, rm, cd) and command_parameters
 * which are different for every command. Examples would be the file_name and 
 * file_size for the touch command and the path of the folder to move into for cd.
 */
function processCommand(full_command) {

    // The full_command is split into it's command_parameters 
    // using the spaces between each components as the delimiter.
    let command_parameters = full_command.split(" ")

    // The command_type is explicitly defined here as it's a
    // component found in all commands.
    let command_type = command_parameters[0]

    // The file_path is also a component in all commands
    // and so it defined.
    let path = command_parameters[1]

    // The size command_component could be Null as
    // it's not a component for certain commands.
    // It's converted from a String to a Number here as well.
    let size = Number(command_parameters[2])
    
    // Create a seperate file system called oldFileSystem
    // which we compare with our fileSystem after a command
    // to see if the command failed or not.
    let oldFileSystem = fileSystem

    // Define new position for later.
    let newPosition

    function onError() {
        console.log("Invalid input")
        errorAudio.play()
        // play error sound
    }

    // Switch case allows every command_type to correspond to the 
    // functions and code that command needs.
    switch (command_type) {
        case "touch":
            // The size of a file is a nessessary parameter
            // and if this parameter is NaN (Not a Number),
            // then there's an error and our program logs
            // that an error occured.
            if (size == NaN) {
                break
            }

            fileSystem = itemOperations.touch(currentPosition, path, size, fileSystem)
            if (fileSystem === oldFileSystem) {
                onError()
            }
            break

        case "mkdir":

            fileSystem = itemOperations.rm(itemOperations.get_position(path, fileSystem), fileSystem)
            if (fileSystem === oldFileSystem) {
                onError()
            }
            break

        case "rm":
            
            fileSystem = itemOperations.rm(itemOperations.get_position(path, fileSystem), path, fileSystem)
            if (fileSystem === oldFileSystem) {
                onError()
            }
            break

        case "rmdir":
            fileSystem = itemOperations.rmdir(itemOperations.get_position(path, fileSystem), fileSystem)
            if (fileSystem === oldFileSystem) {
                onError()

            }
            break

        case "cd":
            if (path.includes() ) {
                newPosition = itemOperations.move_up(path, currentPosition, fileSystem)
                if (currentPosition === newPosition) {
                    onError()

                } else {
                    currentPosition = newPosition
                }
            } else {
                newPosition = itemOperations.cd(path, currentPosition, fileSystem)
                if (currentPosition === newPosition) {
                    onError()

                } else {
                    currentPosition = newPosition
                }
            }
            
            break
        default:
            onError()
            break;
    }
    displayChildren(currentPosition);
    currentFolderName = itemOperations.get_item_name(itemOperations.get_item_at(currentPosition))
    document.getElementById("directory").innerHTML = currentFolderName;
}
processCommand("cd documents")
console.log(currentPosition)
