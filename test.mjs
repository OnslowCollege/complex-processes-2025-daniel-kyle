// import fs from "node:fs";
// import { isString } from "node:util";
// import { isStringObject } from "node:util/types";

import { create } from "domain"

// const jsonData = fs.readFileSync('./system.json', 'utf8');
// console.log(jsonData.split("\n"));

const fileSystem = [
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
    ]
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
            index++   
        } 
        level++
    }
}

function deleteItemwhile(itemLevel, itemIndex, fileSystem) {
    // Level of the item
    console.log(itemIndex)
    console.log(itemLevel)
    console.log()
    let parentName = fileSystem[itemLevel][itemIndex][0]
    let currentLevel = itemLevel
    const maxlevel = fileSystem.length - 1
    let itemExists = false
    while (currentLevel <= maxlevel) {
        if (!itemExists) {
            return true
        }
        let currentIndex = 0
        let maxIndex = fileSystem[currentLevel].length - 1
        itemExists = false
        while (currentIndex <= maxIndex) {
            let itemParent = fileSystem[currentLevel][currentIndex][3]
            if (itemParent === parentName) {
                deleteItemAt(currentLevel, itemIndex, fileSystem)
                itemExists = true
            }
            currentIndex++
        }
        currentLevel++
    }
    console.log("Item does not exist")
    return false
}

function deleteItem(itemLevel, itemIndex, fileSystem) {
    // Level of the item
    console.log(itemIndex)
    console.log(itemLevel)
    console.log()
    let parentName = fileSystem[itemLevel][itemIndex][0]
    let currentLevel = itemLevel
    const maxlevel = fileSystem.length - 1
    let itemExists = false
    for (let level of fileSystem) {
        for (let item of level) {
            itemName = item[0]
            if (itemName === parentName) {

            }
        }
    }
}

function deleteItemAt(itemLevel, itemIndex, fileSystem) {
    console.log("deleting item at [", itemIndex, itemIndex, "]")
    fileSystem[itemLevel] = removeAt(itemIndex, fileSystem[itemLevel])
}

function removeAt(index, array) {
    console.log("removeAt() is running")
    let bucket = []
    let iteration = 0
    while (iteration <= index) {
        bucket.unshift(array.shift())
        iteration++
    }
    // removes the element at that index
    bucket.shift()
    console.log("element removed")

    iteration = 0

    while (iteration <= (index - 1)) {
        array.unshift(bucket[iteration])
        iteration++
    }

    return array
}

// deleteFile("downloads", 0, 0, file_system)
// console.log(file_system)

console.log(fileSystem)

createItem(1, "images", 5, false, "home", fileSystem)

console.log(fileSystem)

// Our New Node system is done and it goes like this
// Data structure List[List[Tuple[String, Int, Bool, List[String]]]]
// Now the first list (List[...]) contains the levels. These levels start at 0 (the root) and go as deep as whatever.
// The second list contains the items inside a level.
// The tuple contains the "attribues" of every item cause this is mimicing objects.
// The forth list inside the tuple contains the names of the children of the item.
// assuming the item has children.

// will leave error handing for later

function createItem(level, name, size, isFile, parent, fileSystem) {
    const newItem = [
        name,
        size,
        isFile,
        parent
    ]

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

switch ("touch") {

    case "touch":
        createItem(
            1,
            "other",
            5,
            false,
            "home",
            fileSystem
        )

    case "mkdir":
        createItem

    case "rm":
        deleteItemAt

    case "rmdir":
        deleteItemAt

    case "cd":
        let [dirLevel, dirIndex] = currentDirectoryPos
        const dirParentName = fileSystem[dirLevel][dirIndex][3]
        let segmentedPath = currentDirectoryPath.split("/")
        segmentedPath.shift()
        console.log(segmentedPath)

        const newPos = getPosition(currentDirectoryPath)
        currentDirectoryPos = newPos
        currentDirectoryPath = currentDirectoryPath
}