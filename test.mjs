// import fs from "node:fs";
// import { isString } from "node:util";
// import { isStringObject } from "node:util/types";

import { create } from "domain"

// const jsonData = fs.readFileSync('./system.json', 'utf8');
// console.log(jsonData.split("\n"));

let fileSystem = [
    [
        [
            "home",
            5,
            false,
            ""
        ]
    ],

    [
        [
            "documents",
            5,
            false,
            "home"
        ],
        [
            "downloads",
            5,
            false,
            "home"
        ]
    ],


]



function getPosition(itemPath, fileSystem) {
    const delimiter = "/"
    let segmentedPath = itemPath.split(delimiter)

    // removes the empty string.
    segmentedPath.shift()
    console.log("segmented name is", segmentedPath)
    const maxLevel = fileSystem.length - 1
    console.log(`the filesystem has ${maxLevel} level/s`)
    let level = 1
    while (level <= maxLevel) {
        let index = 0
        let maxIndex = fileSystem[level].length - 1
        while (index <= maxIndex) {
            let parent = fileSystem[level][index][3]
            console.log("parent is", parent)
            console.log(segmentedPath[level-1])
            console.log(segmentedPath.length)
            if (parent === segmentedPath[level - 1]) {
                console.log("yeah")
                if (level === segmentedPath.length - 1)  {
                    // returns the level, index of the element.
                    return [level, index]
                }
                break
            }
            index++;
        } 
        level++;
    }
}

function deleteItemAt(itemIndex, itemLevel, fileSystem) {
    console.log("deleting item at [", itemIndex, itemIndex, "]")
    fileSystem[itemLevel] = removeAt(itemIndex, fileSystem[itemLevel])
}

function removeAt(index, level) {
    console.log("removeAt() is running")
    let bucket = []
    let iteration = 0
    while (iteration <= index) {
        bucket.unshift(level.shift())
        iteration++
    }
    // removes the element at that index
    bucket.shift()
    console.log("element removed")

    iteration = 0

    while (iteration <= (index - 1)) {
        level.unshift(bucket[iteration])
        iteration++
    }

    return level
}

function deleteFolder(index, level, fileSystem) {
    // A pool of positions of items to delete. [index, level]
    let currentLevel = level
    let removePool = []
    let targetNames = []
    const newNameLevel = []
    let targetNameLevel = 0
    let targetName = fileSystem[level][index][0]

    if (targetNames.length - 1 != targetNameLevel) {
        targetNames.push(newNameLevel)
    }
    targetNames[targetNameLevel].push(targetName)

    removePool.push([index, level])
    currentLevel++
    let currentIndex = 0

    while (true) {

        if (currentLevel >= fileSystem.length) {
            break
        }

        let currentItem = fileSystem[currentLevel][currentIndex]
        let currentName = currentItem[0]
        let currentParent = currentItem[3]
        console.log(targetNames[targetNameLevel])
        console.log(currentParent)

        if (targetNames[targetNameLevel].includes(currentParent)) {
            if (targetName.length - 1 != targetNameLevel) {
                targetNames.push(newNameLevel)
            }
            targetNames[targetNameLevel].push(currentName)
            removePool.push([currentIndex, currentLevel])
        }

        currentIndex++
        if (currentIndex == fileSystem[currentLevel].length) {
            currentIndex = 0
            currentLevel++
            targetNameLevel++
        }
    }

    removePool = removePool.sort((a, b) => {
    return  b[0] - a[0];
    });
    console.log(removePool)
    for (const [indexPos, levelPos] of removePool) {
    deleteItemAt(indexPos, levelPos, fileSystem)
    }
    console.log(fileSystem)
}

// deleteFile("downloads", 0, 0, fileSystem)
// console.log(fileSystem)

// Our New Node system is done and it goes like this
// Data structure List[List[Tuple[String, Int, Bool, List[String]]]]
// Now the first list (List[...]) contains the levels. These levels start at 0 (the root) and go as deep as whatever.
// The second list contains the items inside a level.
// The tuple contains the "attribues" of every item cause this is mimicing objects.
// The forth list inside the tuple contains the names of the children of the item.
// assuming the item has children.

// will leave error handing for later

function createItem(level, name, size, isFile, parent, fileSystem) {
    let newItem = [
        name,
        size,
        isFile,
        parent
    ]
    console.log(fileSystem)
    console.log(level)
    console.log(newItem)
    fileSystem[level].push(newItem)
}

function getNameFromPos(level, index, fileSystem) {
    const name = fileSystem[level][index][0]
    return name
}

const startingDirectoryPos = [0,0]
const startingDirectoryPath = ""


let currentDirectoryPos = startingDirectoryPos

let currentDirectoryPath = startingDirectoryPath

// console.log(fileSystem)

// createItem(1, "images", 5, false, "home", fileSystem)


switch ("touch") {

    case "touch":
        console.log("creating item")
        createItem(1, "other.txt", 5, false, "home", fileSystem)
        break

    case "mkdir":
        createItem(
            1,
            ""
        )
        break

    case "rm":
        // deleteItemAt()
        break

    case "rmdir":
        
        break

    case "cd":
        let [dirLevel, dirIndex] = currentDirectoryPos
        const dirParentName = fileSystem[dirLevel][dirIndex][3]
        let segmentedPath = currentDirectoryPath.split("/")
        segmentedPath.shift()
        console.log(segmentedPath)

        const newPos = getPosition(currentDirectoryPath)
        currentDirectoryPos = newPos
        currentDirectoryPath = currentDirectoryPath
        break
    case "":
        break
}

// error handeling

function hasExtension(fileName) {
    let has = false
    const extensionDelimiter = "."
    for (const symbol of fileName) {
        if (symbol === extensionDelimiter) {
            has = true
            break
        }
    }
    return has
}

// check if correct num arguments are present

// correct ext length
// corrent file length

// solved with validate length

// correct extension symbols
// correct file words

// solves with alphanum func

deleteFolder(0, 0, fileSystem)
