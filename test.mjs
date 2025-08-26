// import fs from "node:fs";
// import { isString } from "node:util";
// import { isStringObject } from "node:util/types";

// const jsonData = fs.readFileSync('./system.json', 'utf8');
// console.log(jsonData.split("\n"));

const file_system = [
    [
        [
            "home",
            5,
            false,
            [
                "documents",
                "downloads"
            ]
        ]
    ],

    [
        [
            "documents",
            5,
            false,
            []
        ],
        [
            "downloads",
            5,
            false,
            []
        ]
    ]
]



function findPosition(itemPath, file_system) {
    const delimiter = "/"
    let segmentedPath = itemPath.split(delimiter)

    // removes the empty string.
    segmentedPath.shift()
    console.log("segmented name is", segmentedPath)
    const levels = file_system.length - 1
    console.log(`the filesystem has ${levels} level/s`)
    let level = 0
    while (level <= levels) {
        let index = 0
        while (index <= file_system[level].length - 1) {
            let name = file_system[level][index][0]
            console.log("name is", name)
            if (name === segmentedPath[level]) {
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

function deleteFile(fileName, parentLevel, parentIndex, file_system) {
    console.log("deleteFile() is running")
    let isDeleted = false
    while (!isDeleted) {
        console.log("deleteFile is looping")
        const fileLevel = parentLevel + 1
        let index = 0
        let validChildren = file_system[parentLevel][parentIndex][3]
        for (let fileNode of file_system[fileLevel]) {
            console.log(`deleteFile() has for looped ${index} times`)
            let name = fileNode[0]
            if (validChildren.includes(name)) {
                if (name === fileName) {
                    console.log("deleteFile is validating")
                    file_system[fileLevel] = removeAt(index, file_system[fileLevel])
                    console.log("validated")
                    isDeleted = true
                    break
                }
            }
            index++;
        }

    }
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

console.log(findPosition("/home/downloads", file_system))

// Our New Node system is done and it goes like this
// Data structure List[List[Tuple[String, Int, Bool, List[String]]]]
// Now the first list (List[...]) contains the levels. These levels start at 0 (the root) and go as deep as whatever.
// The second list contains the items inside a level.
// The tuple contains the "attribues" of every item cause this is mimicing objects.
// The forth list inside the tuple contains the names of the children of the item.
// assuming the item has children.

// will leave error handing for later