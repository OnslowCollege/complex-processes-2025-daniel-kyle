

// Don't make this gleam code 
function newElement(text: string) {
    let ul: HTMLElement = document.getElementById("contents")!; // Get the <ul>
    let li: HTMLElement = document.createElement("li");        // Create a new <li>
    li.textContent = text;                        // Set its text
    ul.appendChild(li);
}


// Don't make this gleam code 
document.getElementById("command")!.onsubmit = function(event) {
    event.preventDefault(); // Prevent the form from submitting
    let commandInput: string = (document.querySelector("input[name='command']") as HTMLInputElement)!.value.trim();
    processCommand(commandInput);
};

// No need to remake the constants in gleam.

// What seperates each file in the file path name.
const itemDelimiter: string = "/";

// What seperates each command in the full command.
const commandDelimiter: string = " ";

// What seperates the extension from the file name.
const extensionDelimiter: string = ".";

// The base size of each file in KB.
const basefileSize: number = 1;

// The longest a file/folder name can be.
const maxItemNameLength: number = 12;

// The shortest a file/folder name can be.
const minItemNameLength: number = 1;

// The length a file extension should be.
const extensionNameLength: number = 3;

// An empty splitter.
const emptyCharacter: string = "";

// The minimum size a file can be.
const minfileSize: number = 1;

// The maximum size a file can be.
const maxfileSize: number = 4194304;

// Command for cd that allows the user to move up a folder.
const moveUpCommand: string = "..";

// Make this a gleam class if you can
/**
 * Basic structure for files and folders.
 */
abstract class ItemNode {
    // Child nodes under the current item.
    children: ItemNode[] = [];

    // The base size of the item.
    baseSize: number = 1;

    // The scientific name of the item.
    path: string = "";

    /**
     * @param name - The name of the taxanomic level.
     * @param parentFolder - The parent node of this node, will be a group.
     */
    constructor(public name: string, public parentFolder: ItemNode | null = null) {

    // Adds this node as a child of it's parents.
    // Pushes itself into it's parent's children array.
    this.parentFolder?.children.push(this);

    // The full scientific name of the node, including it's own name.
    this.path = parentFolder === null ? itemDelimiter + name : parentFolder.path + itemDelimiter + name;

    }

    // This is a size getter so the user can get the size of the item.
    get size(): number { return this.baseSize + this.children.reduce(
        (totalSize, child) => totalSize + child.size, 0)}
}
    
// Make this a gleam class if you can
/**
 * Represents a folder.
 */
class FolderNode extends ItemNode {

    // The base size of each folder.
    baseSize: number = 5;

    constructor(public name: string, public parentFolder: ItemNode | null = null) {

        super(name, parentFolder);
        
    }
}

// Make this a gleam class if you can
class FileNode extends ItemNode {

    // The baseSize of the file.
    baseSize: number = 1;

    /**
     * 
     * @param name - The name of the file.
     * @param fileSize The size of the file in KB, 1 if left empty.
     * @param parentFolder The parent folder of the file.
     */
    constructor(public name: string,  public parentFolder: ItemNode, public fileSize: number | null = null) {
        // Since we're reusing the constructor we must use super.
        super(name, parentFolder)

        // Uses the terninary operator to check if the size entered is not null.
        // Makes the file size the size entered if it's not null and the basesize otherwise
        this.fileSize = this.fileSize != null ? this.fileSize : this.baseSize;
    }

    // Has to override the size getter as we are changing it.
    override get size(): number {  
        return this.fileSize as number
    }
}

// No need to make this in gleam.
// Inisitlisations of folders.

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

const mp31 = new FileNode("1.mp3", music);

const mp32 = new FileNode("2.mp3", music);

const mp33 = new FileNode("3.mp3", music);

const mp34 = new FileNode("4.mp3", music);

const mp35 = new FileNode("5.mp3", music);

const mp36 = new FileNode("6.mp3", music);

const mp37 = new FileNode("7.mp3", music);

const mp38 = new FileNode("8.mp3", music);

const mp39 = new FileNode("9.mp3", music);

const mp310 = new FileNode("10.mp3", music);

// The folder the user starts in.
const startingFolder: FolderNode = home

// Functions
// They get hoised to the top of the code anyways.


// Make this a gleam function
/**
 * 
 * @param slicedCommand - An array of the command arguments.
 * @param folder - The folder being targeted.
 * @param isFile - Boolean indicating if the target is a file or folder.
 * @returns - undefined
 */
function removeItemFromFolder (
    slicedCommand: string[], 
    folder: FolderNode, 
    isFile: boolean) {

    // Uses terninary operator to get the typeof node it is based on the boolean.
    const nodeType: typeof FileNode | typeof FolderNode = isFile ? FileNode : FolderNode

    // Another use of it to get the item type based on the boolean.
    const itemType: string = isFile ? "File" : "Folder"

    // Gets the file name of the file from the command.
    const delfileName: string = slicedCommand[1];

    // Current index of the current folder's children array.
    let currentIndex: number = 0
    let foundItem: boolean = false
    for (let child of folder.children) {
            if (child.name === delfileName && child instanceof nodeType) {
                // Removes the child with the appropriate fileName.
                folder.children.splice(currentIndex)
                foundItem = true
                break
            }
            // Incriments the current index by 1.
            ++currentIndex
        }
    
    // Checks if the item is not real.
    if (!foundItem) {
        console.log(`${itemType} does not exist.`)
    }

}

// Make this a gleam function
/**
 * 
 * @param folder - The folder who's children will be displayed. 
 */
function displayParents (folder: FolderNode) {
    // The default number of spaces betwen the file/folder name and it's details.
    const defaultSpaces: number = 25

    // The spacing characters seperating the file/folder name and it's details.
    const spacer = " "

    document.getElementById("contents")!.innerHTML = ""; // Clear the list

    for (let child of folder.children) {
        // Makes the prefix 'dir' if the child is a folder.
        // Makes the prefix 'file' if the child is a file.
        let prefix: string = child instanceof FolderNode ? "dir" : "file"

        // The spaces between the file/folder name and the details.
        let spaces: number = defaultSpaces - child.name.length - 1

        // The spacing between the file/folder name and the details.
        let spacing: string = spacer.repeat(spaces)

        // The name of the file/folder and it's details

        newElement(`/${child.name}${spacing}(${prefix} - ${child.size} KB)`)


    }

    // Displays the total size of the contained files and folders in KB.
    newElement(`\nTOTAL: ${folder.size - folder.baseSize} KB`)
    
}

// Make this a gleam function
/**
 * 
 * @param searchedFolder - Current folder being searched.
 * @param splitPath - The split array of folders.
 * @returns The folder if found or undefined if not found.
 */
function getItemFromFolder(searchedFolder: FolderNode, splitPath: string[]): FolderNode | undefined {
    if (splitPath.length > 0) {
        // Searches the folder for a folder with a matching folder name
        for (let folder of searchedFolder.children) {
            if (folder.name === splitPath[0] && folder instanceof FolderNode) {
                splitPath.shift();
                return getItemFromFolder(folder, splitPath);
            }
        }
        // If the folder is not found, return undefined.
        return undefined;
    }
    return searchedFolder;
}

// Make this a gleam function
/**
 * 
 * @param text The text being checked.
 * @returns A boolean indicating if the text has only 
 * lowercase alphanumberic characters (true) or not (false)
 */
function isLowerCaseAlphaNumberic(text: string): boolean {
    // Uses RegEx to check if the text only contains lowercase letters a-z and numbers 0-9.
    // Returns true if the text contains only lowercase letters and numbers and false if not.


    const lettersNumbers = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    for (let character of text) {
        // Checks if the character is not a letter or number.
        if (!lettersNumbers.includes(character)) {
            return false;
        }
    }

    return true;

}

/**
 * 
 * @param folder - The folder object you want to search.
 * @param name - The name of the file/folder you want to search.
 * @returns - A boolean indicating if a file/folder with the same name is present.
 */
function isNameInFolder(folder: FolderNode, name: string): boolean {
    
    // Returns true if any child has the given name and false if not.
    return folder.children.some(child => child.name === name);
}

/**
 * 
 * @param item - The item being erased.
 */
function eraseItemData(item: ItemNode) {

    // First checks if the parent folder exists.
    if (item.parentFolder) {
        item.parentFolder.children = item.parentFolder?.children.filter(child => child !== item)
        item.parentFolder = null
    }
    
}

// Turn this into gleam.
/**
 * 
 * @param folder - The folder who's contents are being removed.
 */
function removeFolderFromFolder(folder: FolderNode) {
    for (let child of folder.children) {
        removeFolderFromFolder(child)
        eraseItemData(child)
    }
}

// Makes the current folder the starting folder.
let currentFolder: FolderNode = startingFolder;

// The command with the maximum amount of argments.
const maxArguments: number = 3;

// Displays the path of the current folder you are in.
// Prompts the user for a command

// Displays the current folder name in the UI.
document.getElementById("directory")!.innerHTML = currentFolder.name

// Don't make this function a cleam function
function processCommand(command: string) {
    const slicedCommand = command.split(commandDelimiter);

    // Picks the starting command from the splitted command.
    let startCommand = slicedCommand[0];

    switch (startCommand) {

        case "ls" : 

            if (command != "ls") {
                console.log("Please only enter the ls command.");
                
                break;
            };
            
            displayParents(currentFolder);
            
            
            break;

        case "touch" :

            // The minimum and maximum command lengths for the touch command
            const validTouchLengths: number[] = [2,3];

            if (!validTouchLengths.includes(slicedCommand.length)) {
                console.log("Please enter the command with the appropriate arguments.")
                
                break;
            };

            // Gets the file name of the file from the command.
            let fullFileName: string | undefined;
            // Gets the file size of the file from the command.
            let fileSize: string | number = slicedCommand[2];

            let targetTouchFolder: FolderNode | undefined;

            let splitTouchPath = slicedCommand[1].split(itemDelimiter);

            // Removes the empty character element if found.
            // If path starts with a slash, remove the empty string and the first folder name (which should be 'home')
            if (splitTouchPath[0] === emptyCharacter) {

                // Removes the blank string.
                splitTouchPath.shift()

                // Removes the first folder name (home).
                splitTouchPath.shift();

                // Removes the name of the file from the array.
                // Returns the name of the file and sets fullFileName to that.
                fullFileName = splitTouchPath.pop();

                // Explicit paths always start from the starting folder which is by default home.
                targetTouchFolder = getItemFromFolder(startingFolder, splitTouchPath)
                
            } else {
                targetTouchFolder = currentFolder
                fullFileName = slicedCommand[1]
            }

            // Checks if the file name is undefined.
            // Tells the user the file doesn't exist
            if (fullFileName === undefined) {
                console.log("File name doesn't exist.")
                
                break;
            }

            // Checks if the target folder is undefined.
            if (targetTouchFolder === undefined) {
                console.log("Path doesn't exist.")
                
                break;
            }

            // Finds the number of extension delimiters by removing them from the file name.
            // Then subrtacting the length of the file name with removed delimiters from the length of the file name.
            const delimiterCount: number = fullFileName.length - 
            fullFileName.replaceAll(extensionDelimiter, emptyCharacter).length;

            // Checks if the full file name doesn't include only 1 extension delimiter. 
            // Tells the user to enter a valid file name.
            if (delimiterCount != 1) {
                console.log(`Please enter one '${extensionDelimiter}' and an extension.`);
                
                break;
            };

            // Splits the file name and the extension.
            const splitfileName: string[] = fullFileName.split(extensionDelimiter);

            // Gets just the file name and not the extension.
            const fileName: string = splitfileName[0];

            // Gets just the extension and not the file name.
            const fileExtension: string = splitfileName[1];

            // Checks if the file name and extension are valid lengths.
            if (fullFileName.length > maxItemNameLength || fileExtension.length != extensionNameLength) {
                console.log("Please enter a file name with a valid length.")
                
                break;
            }

            // Checks if the file doesn't contain only lowercase letters and numbers.
            if (!isLowerCaseAlphaNumberic(fileName) || !isLowerCaseAlphaNumberic(fileExtension)) {
                console.log("Please enter a file name and extension containing only letters and numbers.")
                
                break;
            }
            
            // Checks if the file size is a number.
            if (Number.isNaN(fileSize)) {
                console.log("Please enter a number for the file size.");
                
                break;
            }

            // Checks if the file size is not within the maximum and minimum amounts.
            if (Number(fileSize) < minfileSize || Number(fileSize) > maxfileSize) {
                console.log("The file size is not valid.")
                console.log(`Please enter a fileSize between ${minfileSize} KB and ${maxfileSize} KB.`)
                
                break;
            }

            // Checks if there exists a file with the same name and tells the user to enter another file name.
            if (isNameInFolder(targetTouchFolder, fullFileName)) {
                console.log("A file with the same name already exists in this folder");
                console.log("please enter a different name.");
                
                
                break;
            };

            // Makes the file size the default file size if not specified.
            if (!fileSize) {
                fileSize = basefileSize
            };
            
            // Creates the new file.
            new FileNode(fullFileName, targetTouchFolder, Number(fileSize))

            
            break;

        case "mkdir" : 

            // The minimum and maximum command lengths for the mkdir command.
            const validMkdirLengths: Number[] = [2];

            if (!validMkdirLengths.includes(slicedCommand.length)) {
                console.log("Please enter the command with the appropriate arguments.")
                
                break;
            }

            let targetMkdirFolder: FolderNode | undefined;

            let splitMkdirPath = slicedCommand[1].split(itemDelimiter)

            if (!validMkdirLengths.includes(slicedCommand.length)) {
            console.log("Please enter the command with the appropriate arguments.")
            
            break;
            }

            // Gets the folder name of the folder from the command.
            let folderName: string | undefined;

            // Removes the empty character element if found.
            // If path starts with a slash, remove the empty string and the first folder name (which should be 'home')
            if (splitMkdirPath[0] === emptyCharacter) {
                // Removes the blank string.
                splitMkdirPath.shift()

                // Removes the first folder name (home).
                splitMkdirPath.shift();

                // Removes the name of the folder.
                folderName = splitMkdirPath.pop();

                // Explicit paths always start from the starting folder which is by default home.
                targetMkdirFolder = getItemFromFolder(startingFolder, splitMkdirPath)
                
            } else {
                targetMkdirFolder = currentFolder
                folderName = slicedCommand[1]
            }

            // Checks if the foldername is undefined.
            if (folderName === undefined) {
                console.log("Folder name doesn't exist.")
                
                break;
            }

            if (targetMkdirFolder === undefined) {
                console.log("Folder doesn't exist.")
                
                break;
            }

            // Checks if the name of the folder is a valid length.
            if (folderName.length < minItemNameLength || folderName.length > maxItemNameLength) {
                console.log("Please enter a folder name between 1 and 12 characters.");
                
                break;
            }

            // Checks if there exists a folder with the same name and tells the user to enter another folder name.
            if (isNameInFolder(targetMkdirFolder, folderName)) {
                console.log("A file with the same name already exists in this folder");
                console.log("please enter a different name.");
                
                break;
            };

            // Checks if the folder doesn't contain only lowercase letters and numbers.
            if (!isLowerCaseAlphaNumberic(folderName)) {
                console.log("Please enter a folder name containing only letters and numbers.")
                break;
            }

            // Creates a new folder inside the parent folder.
            new FolderNode(folderName, targetMkdirFolder);

            break;

        case "rm" :

            // The minimum and maximum command lengths for the rm command
            const validRmLengths: Number[] = [2]

            let targetRmFolder: FolderNode | undefined;

            let splitRmPath = slicedCommand[1].split(itemDelimiter)

            if (!validRmLengths.includes(slicedCommand.length)) {
            console.log("Please enter the command with the appropriate arguments.")
            
            break;
            }

            // Removes the empty character element if found.
            // If path starts with a slash, remove the empty string and the first folder name (which should be 'home')
            if (splitRmPath[0] === emptyCharacter) {
                // Removes the blank string.
                splitRmPath.shift();

                // Removes the first folder name (home).
                splitRmPath.shift();

                // Explicit paths always start from the starting folder which is by default home.
                targetRmFolder = getItemFromFolder(startingFolder, splitRmPath)
                
            } else {
                targetRmFolder = currentFolder
                removeItemFromFolder(slicedCommand, targetRmFolder, true);
            }

            
            break;

        case "rmdir" : 

            // The minimum and maximum command lengths for the rm command
            const validRmdirLengths: Number[] = [2]

            let targetRmdirFolder: FolderNode | undefined;

            if (!validRmdirLengths.includes(slicedCommand.length)) {
            console.log("Please enter the command with the appropriate arguments.")
            
            break;
            }

            let splitRmdirPath = slicedCommand[1].split(itemDelimiter)

            // Removes the empty character element if found.
            // If path starts with a slash, remove the empty string and the first folder name (which should be 'home')
            if (splitRmdirPath[0] === emptyCharacter) {
                // Removes the blank string.
                splitRmdirPath.shift();

                // Removes the first folder name (home).
                splitRmdirPath.shift();

                // Explicit paths always start from the starting folder which is by default home.
                targetRmdirFolder = getItemFromFolder(startingFolder, splitRmdirPath)
                
            } else {
                currentFolder.children.some((child) => {
                // Checks if the child is a folder and has the same name as the folder being searched for.
                if (child instanceof FolderNode && child.name === slicedCommand[1]) {
                    targetRmdirFolder = child;
                    return true;
                }
            });
            }

            // Checks if the target folder doesn't exist.
            if (!targetRmdirFolder) {
                console.log("Folder doesn't exist.")
                
                break;
            }

            removeFolderFromFolder(targetRmdirFolder)

            eraseItemData(targetRmdirFolder)

            
            break;

        case "cd" :

            const validCdlength: number[] = [2];

            if (!validCdlength.includes(slicedCommand.length)) {
                console.log("Please enter the command with the appropriate arguments.");
                
                break;
            }

            const folderPath: string = slicedCommand[1]

            if (folderPath === moveUpCommand) {
                    // Checks if the parent folder of the current folder exists.
                    // Before moving up folders.
                    if (currentFolder.parentFolder) {
                        currentFolder = currentFolder.parentFolder
                    } else {
                        console.log("This is the root folder and cannot be moved up.")
                    }

                
                break;
            }

            // Splits the path entered into an array of folder names.
            let splitPath: string[] = folderPath.split(itemDelimiter)

            let targetFolder: FolderNode | undefined;

            // Removes the empty character element if found.
            // If path starts with a slash, remove the empty string and the first folder name (which should be 'home')
            if (splitPath[0] === emptyCharacter) {
                // Removes the blank string.
                splitPath.shift();

                // Removes the first folder name (home).
                splitPath.shift();

                // Explicit paths always start from the starting folder which is by default home.
                targetFolder = getItemFromFolder(startingFolder, splitPath)
    
            } else {
                currentFolder.children.some((child) => {
                // Checks if the child is a folder and has the same name as the folder being searched for.
                if (child instanceof FolderNode && child.name === splitPath[0]) {
                    targetFolder = child;
                    return true;
                }
            });
            }
            

            // Checks if the target folder is undefined.
            if (targetFolder === undefined) {
                console.log("Folder not found.")
                
                break;
            }

            // Sets the targetFolder to a FolderNode as we've checked it's not undefined.
            currentFolder = targetFolder as FolderNode

            
            break;

        default:
            console.log("You have entered an invalid command")
            break;
    
    }

    document.getElementById("directory")!.innerHTML = currentFolder.name;

}
        