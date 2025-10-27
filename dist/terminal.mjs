// Updated terminal.mjs with integrated and fixed displayChildren, file info box, and command handling.
"use strict";

import { is_alphanumeric } from "../build/dev/javascript/file_terminal/validation.mjs";

import { item_delimiter, 
    command_delimiter, 
    extension_delimiter, 
    base_file_size,
    max_name_length,
    min_name_length,
    extension_name_length,
    empty_character,
    min_file_size,
    max_file_size,
    move_up_command
} from "../build/dev/javascript/file_terminal/constants.mjs"; 

function newElement(text) {
    let ul = document.getElementById("contents");
    let li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
}

const successAudio = new Audio();
successAudio.src = "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav";

const errorAudio = new Audio();
errorAudio.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg"

// Command form submission
const commandForm = document.getElementById("command-input");
if (commandForm) {
    commandForm.onsubmit = function (event) {
        event.preventDefault();
        let commandInput = document.querySelector("input[name='command-input']").value.trim();
        processCommand(commandInput);
    };
}

// Item and folder classes
class ItemNode {
    name;
    parentFolder;
    children = [];
    baseSize = 1;
    path = "";

    constructor(name, parentFolder = null) {
        this.name = name;
        this.parentFolder = parentFolder;
        this.parentFolder?.children.push(this);
        this.path = parentFolder === null ? item_delimiter + name : parentFolder.path + item_delimiter + name;
    }

    get size() {
        return this.baseSize + this.children.reduce((totalSize, child) => totalSize + child.size, 0);
    }
}

class FolderNode extends ItemNode {
    baseSize = 5;
    constructor(name, parentFolder = null) {
        super(name, parentFolder);
        this.name = name;
        this.parentFolder = parentFolder;
    }
}

class FileNode extends ItemNode {
    fileSize;
    baseSize = 1;
    constructor(name, parentFolder, fileSize = null) {
        super(name, parentFolder);
        this.name = name;
        this.parentFolder = parentFolder;
        this.fileSize = fileSize != null ? fileSize : this.baseSize;
    }
    get size() {
        return this.fileSize;
    }
}

// Initialize folders and files
const home = new FolderNode("home");
const documents = new FolderNode("documents", home);
const downloads = new FolderNode("downloads", home);
const music = new FolderNode("music", home);
const photos = new FolderNode("photos", home);
const japan = new FolderNode("japan2026", photos);

const tokyo = new FileNode("tokyo.png", japan);
const kyoto = new FileNode("kyoto.jpg", japan);
const miyajima = new FileNode("miyajima.gif", japan);
const passport = new FileNode("passport.jpg", photos);
const photoid = new FileNode("photoid.png", photos);
const cv = new FileNode("cv.pdf", music);
const data = new FileNode("data.dat", music);

for (let i = 1; i <= 10; i++) {
    new FileNode(i + ".mp3", music);
}

const startingFolder = home;
let currentFolder = startingFolder;
document.getElementById("directory").innerHTML = currentFolder.name;

// Utility functions
function removeItemFromFolder(slicedCommand, folder, isFile) {
    const nodeType = isFile ? FileNode : FolderNode;
    const itemType = isFile ? "File" : "Folder";
    const delfileName = slicedCommand[1];
    let currentIndex = 0;
    let foundItem = false;
    for (let child of folder.children) {
        if (child.name === delfileName && child instanceof nodeType) {
            folder.children.splice(currentIndex, 1);
            foundItem = true;
            break;
        }
        ++currentIndex;
    }
    if (!foundItem) console.log(`${itemType} does not exist.`);
}

function getItemFromFolder(searchedFolder, splitPath) {
    if (splitPath.length > 0) {
        for (let folder of searchedFolder.children) {
            if (folder.name === splitPath[0] && folder instanceof FolderNode) {
                splitPath.shift();
                return getItemFromFolder(folder, splitPath);
            }
        }
        return undefined;
    }
    return searchedFolder;
}

function isNameInFolder(folder, name) {
    return folder.children.some(child => child.name === name);
}

function eraseItemData(item) {
    if (item.parentFolder) {
        item.parentFolder.children = item.parentFolder?.children.filter(child => child !== item);
        item.parentFolder = null;
    }
}

function removeFolderFromFolder(folder) {
    for (let child of folder.children) {
        removeFolderFromFolder(child);
        eraseItemData(child);
    }
}

// === File info box ===
const infoBox = document.createElement('div');
infoBox.id = 'info-box';
Object.assign(infoBox.style, {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '15px 20px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
  backdropFilter: 'blur(10px)',
  color: '#72FDAC',
  display: 'none',
  maxWidth: '300px',
  fontFamily: 'monospace',
  transition: 'opacity 0.3s ease'
});
document.body.appendChild(infoBox);

function showFileInfo(file, folder) {
  infoBox.innerHTML = `
    <strong>📄 File Details</strong><br>
    Name: ${file.name}<br>
    Size: ${file.size} KB<br>
    Path: ${folder.path}/${file.name}
  `;
  infoBox.style.display = 'block';
  infoBox.style.opacity = '1';

  clearTimeout(infoBox.fadeTimeout);
  infoBox.fadeTimeout = setTimeout(() => {
    infoBox.style.opacity = '0';
    setTimeout(() => (infoBox.style.display = 'none'), 300);
  }, 4000);
}

// === displayChildren function ===
function displayChildren(folder) {
    const contentsEl = document.getElementById("contents");
    const pathEl = document.getElementById("current-path");

    if (!contentsEl) return;

    if (pathEl) pathEl.textContent = folder.path;
    contentsEl.innerHTML = "";

    for (const child of folder.children) {
        const li = document.createElement("li");
        const isFolder = child instanceof FolderNode;
        li.textContent = `${isFolder ? "📁" : "📄"} ${child.name} (${child.size} KB)`;
        li.style.cursor = "pointer";

        if (isFolder) {
            li.addEventListener("click", () => {
                currentFolder = child;
                successAudio.play();
                displayChildren(currentFolder);
                document.getElementById("directory").innerHTML = currentFolder.name;
            });
        } else {
            li.addEventListener("click", () => showFileInfo(child, folder));
        }

        contentsEl.appendChild(li);
    }

    newElement(`\nTotal folder size: ${folder.size - folder.baseSize} KB`);
}

// === Command boxes clickable ===
document.querySelectorAll('.command-contents').forEach(button => {
    button.addEventListener('click', () => {
        const command = button.getAttribute('data-command');
        
        switch(command) {
            case 'rm':
                displayCommandOptions(currentFolder, true, 'rm'); // show files
                break;
            case 'rmdir':
                displayCommandOptions(currentFolder, false, 'rmdir'); // show folders
                break;
            case 'cd':
                displayCommandOptions(currentFolder, false, 'cd'); // show folders to navigate
                break;
            default:
                processCommand(command); // normal commands like touch/mkdir
        }
    });
});

// === Accessibility toggle ===
const accessToggle = document.getElementById('accessToggle');
if (accessToggle) {
    accessToggle.addEventListener('change', () => {
        document.body.classList.toggle('accessibility', accessToggle.checked);
    });
}

// Display initial folder
displayChildren(currentFolder);

// === processCommand function ===
function processCommand(command) {
    const slicedCommand = command.split(command_delimiter);
    const startCommand = slicedCommand[0];
    let fullItemName = slicedCommand[1];
    let ItemSize = slicedCommand[2];

    switch (startCommand) {
        case "touch":
            {
                const validTouchLengths = [2,3];
                if (!validTouchLengths.includes(slicedCommand.length)) { console.log("Please enter the command with the appropriate arguments."); errorAudio.play(); break; }

                let fullFileName, fileSize, targetTouchFolder;
                let splitTouchPath = slicedCommand[1].split(item_delimiter);
                if (splitTouchPath[0] === empty_character) {
                    splitTouchPath.shift();
                    splitTouchPath.shift();
                    fullFileName = splitTouchPath.pop();
                    targetTouchFolder = getItemFromFolder(startingFolder, splitTouchPath);
                } else {
                    targetTouchFolder = currentFolder;
                    fullFileName = slicedCommand[1];
                }

                if (!fullFileName) { console.log("File name doesn't exist."); errorAudio.play(); break; }
                if (!targetTouchFolder) { console.log("Path doesn't exist."); errorAudio.play(); break; }

                const delimiterCount = fullFileName.length - fullFileName.replaceAll(extension_delimiter, empty_character).length;
                if (delimiterCount != 1) { console.log(`Please enter one '${extension_delimiter}' and an extension.`); errorAudio.play(); break; }

                const [fileName, fileExtension] = fullFileName.split(extension_delimiter);
                if (fullFileName.length > max_name_length || fileExtension.length != extension_name_length) { console.log("Please enter a file name with a valid length."); errorAudio.play(); break; }
                if (!is_alphanumeric(fileName) || !is_alphanumeric(fileExtension)) { console.log("Please enter a file name and extension containing only letters and numbers."); errorAudio.play(); break; }

                fileSize = slicedCommand[2] ? Number(slicedCommand[2]) : base_file_size;
                if (Number.isNaN(fileSize)) { console.log("Please enter a number for the file size."); errorAudio.play(); break; }
                if (fileSize < min_file_size || fileSize > max_file_size) { console.log(`Please enter a fileSize between ${min_file_size} KB and ${max_file_size} KB.`); errorAudio.play(); break; }
                if (isNameInFolder(targetTouchFolder, fullFileName)) { console.log("A file with the same name already exists in this folder. Please enter a different name."); errorAudio.play(); break; }

                new FileNode(fullFileName, targetTouchFolder, fileSize);
                successAudio.play();
            }
            break;
        case "mkdir":
            {
                const validMkdirLengths = [2];
                if (!validMkdirLengths.includes(slicedCommand.length)) { console.log("Please enter the command with the appropriate arguments."); errorAudio.play(); break; }

                let targetMkdirFolder, folderName;
                let splitMkdirPath = slicedCommand[1].split(item_delimiter);
                if (splitMkdirPath[0] === empty_character) {
                    splitMkdirPath.shift();
                    splitMkdirPath.shift();
                    folderName = splitMkdirPath.pop();
                    targetMkdirFolder = getItemFromFolder(startingFolder, splitMkdirPath);
                } else {
                    targetMkdirFolder = currentFolder;
                    folderName = slicedCommand[1];
                }

                if (!folderName) { console.log("Folder name doesn't exist."); errorAudio.play(); break; }
                if (!targetMkdirFolder) { console.log("Folder doesn't exist."); errorAudio.play(); break; }
                if (folderName.length < min_name_length || folderName.length > max_name_length) { console.log("Please enter a folder name between 1 and 12 characters."); errorAudio.play(); break; }
                if (isNameInFolder(targetMkdirFolder, folderName)) { console.log("A file with the same name already exists in this folder. Please enter a different name."); errorAudio.play(); break; }
                if (!is_alphanumeric(folderName)) { console.log("Please enter a folder name containing only letters and numbers."); errorAudio.play(); break; }

                new FolderNode(folderName, targetMkdirFolder);
                successAudio.play();
            }
            break;
        case "rm":
            {
                const validRmLengths = [2];
                if (!validRmLengths.includes(slicedCommand.length)) { console.log("Please enter the command with the appropriate arguments."); errorAudio.play(); break; }

                let targetRmFolder;
                let splitRmPath = slicedCommand[1].split(item_delimiter);
                if (splitRmPath[0] === empty_character) {
                    splitRmPath.shift();
                    splitRmPath.shift();
                    targetRmFolder = getItemFromFolder(startingFolder, splitRmPath);
                } else {
                    targetRmFolder = currentFolder;
                    removeItemFromFolder(slicedCommand, targetRmFolder, true);
                }
                successAudio.play();
            }
            break;
        case "rmdir":
            {
                const validRmdirLengths = [2];
                if (!validRmdirLengths.includes(slicedCommand.length)) { console.log("Please enter the command with the appropriate arguments."); errorAudio.play(); break; }

                let targetRmdirFolder;
                let splitRmdirPath = slicedCommand[1].split(item_delimiter);
                if (splitRmdirPath[0] === empty_character) {
                    splitRmdirPath.shift();
                    splitRmdirPath.shift();
                    targetRmdirFolder = getItemFromFolder(startingFolder, splitRmdirPath);
                } else {
                    currentFolder.children.some(child => {
                        if (child instanceof FolderNode && child.name === slicedCommand[1]) {
                            targetRmdirFolder = child;
                            return true;
                        }
                    });
                }
                if (!targetRmdirFolder) { console.log("Folder doesn't exist."); errorAudio.play(); break; }
                removeFolderFromFolder(targetRmdirFolder);
                eraseItemData(targetRmdirFolder);
                successAudio.play();
            }
            break;
        case "cd":
            {
                const validCdLengths = [2];
                if (!validCdLengths.includes(slicedCommand.length)) { console.log("Please enter the command with the appropriate arguments."); errorAudio.play(); break; }

                const folderPath = slicedCommand[1];
                if (folderPath === move_up_command) {
                    if (currentFolder.parentFolder) {
                        currentFolder = currentFolder.parentFolder;
                        successAudio.play();
                    } else {
                        console.log("This is the root folder and cannot be moved up.");
                        errorAudio.play();
                    }
                    break;
                }

                let splitPath = folderPath.split(item_delimiter);
                let targetFolder;
                if (splitPath[0] === empty_character) {
                    splitPath.shift();
                    splitPath.shift();
                    targetFolder = getItemFromFolder(startingFolder, splitPath);
                } else {
                    currentFolder.children.some(child => {
                        if (child instanceof FolderNode && child.name === splitPath[0]) {
                            targetFolder = child;
                            return true;
                        }
                    });
                }
                if (!targetFolder) { console.log("Folder not found."); errorAudio.play(); break; }
                currentFolder = targetFolder;
                successAudio.play();
            }
            break;
        default:
            console.log("You have entered an invalid command");
            errorAudio.play();
            break;
    }

    displayChildren(currentFolder);
    document.getElementById("directory").innerHTML = currentFolder.name;
}
function displayCommandOptions(folder, isForFiles = true, commandType = '') {
    const resultsEl = document.getElementById('command-results');
    resultsEl.innerHTML = ''; // clear previous options

    const items = folder.children.filter(child => isForFiles ? child instanceof FileNode : child instanceof FolderNode);

    if (items.length === 0) {
        const noItemBox = document.createElement('div');
        noItemBox.textContent = isForFiles ? 'No files found' : 'No folders found';
        noItemBox.style.padding = '10px';
        noItemBox.style.border = '1px solid #555';
        noItemBox.style.borderRadius = '5px';
        resultsEl.appendChild(noItemBox);
        return;
    }

    items.forEach(item => {
        const box = document.createElement('div');
        box.textContent = `${item instanceof FolderNode ? '📁' : '📄'} ${item.name}`;
        box.style.padding = '10px';
        box.style.border = '1px solid #72FDAC';
        box.style.borderRadius = '5px';
        box.style.cursor = 'pointer';
        box.style.transition = 'all 0.2s';
        box.addEventListener('mouseover', () => box.style.backgroundColor = 'rgba(114,253,172,0.2)');
        box.addEventListener('mouseout', () => box.style.backgroundColor = 'transparent');

        box.addEventListener('click', () => {
            // handle the clicked item according to commandType
            switch(commandType) {
                case 'rm':
                    processCommand(`rm|${item.name}`);
                    break;
                case 'rmdir':
                    processCommand(`rmdir|${item.name}`);
                    break;
                case 'cd':
                    processCommand(`cd|${item.name}`);
                    break;
                case 'touch':
                    processCommand(`touch|${item.name}`);
                    break;
                default:
                    console.log('Unknown command type for selection');
            }

            resultsEl.innerHTML = ''; // clear after selection
        });

        resultsEl.appendChild(box);
    });
}