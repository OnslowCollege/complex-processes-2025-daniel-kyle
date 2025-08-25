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
    segmentedPath = itemPath.split("/")
    level = 0
    for (let item of file_system[level]) {
        let name = item[0]
        if (name === segmentedPath(level)) {
            
        }
    }
    // returns the level, index of the element.
    return [level, index]
}

function deleteFile(fileName, level, index, file_system) {
    let isDeleted = false
    while (!isDeleted) {
        const fileLevel = level + 1
        let validChildren = file_system[level][index][3]
        for (let fileNode of file_system[fileLevel]) {
            let name = fileNode[0]
            if (validChildren.includes(name)) {
                if (name === fileName) {
                    file_system[fileLevel] = removeAt(index, file_system[fileLevel])
                    isDeleted = true
                    break
                }
            }
            index++;
        }

    }
}

function removeAt(index, array) {
    let bucket = []
    let iteration = 0
    while (iteration <= index) {
        bucket.unshift(array.shift())
        iteration++
    }
    // removes the element at that index
    bucket.shift()


    iteration = 0

    while (iteration <= (index - 1)) {
        array.unshift(bucket[iteration])
    }

    return array
}

deleteFile("documents", file_system)
console.log(file_system)


// Our New Node system is done and it goes like this
// Data structure List[List[Tuple[String, Int, Bool, List[String]]]]
// Now the first list (List[...]) contains the levels. These levels start at 0 (the root) and go as deep as whatever.
// The second list contains the items inside a level.
// The tuple contains the "attribues" of every item cause this is mimicing objects.
// The forth list inside the tuple contains the names of the children of the item.
// assuming the item has children.