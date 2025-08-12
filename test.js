// import { is_valid } from "./build/dev/javascript/file_terminal/file_terminal.mjs"; // Use curly braces for named exports

// console.log(is_valid("example")); // Should log true or false based on the validation logic

const fs = require('fs');

const fileSrc = './system.json'

function writtenTo(){
    console.log("Json file was written to.")
}

const obj = fs.readFile(fileSrc, writtenTo)

console.log(JSON.parse(obj))

const myFile = {
    name : "",
    children : [],

};

const jsonData = JSON.stringify(myData, null, 2); // null and 2 for pretty-printing (indentation)


fs.writeFile(fileSrc, myFile, writtenTo);
