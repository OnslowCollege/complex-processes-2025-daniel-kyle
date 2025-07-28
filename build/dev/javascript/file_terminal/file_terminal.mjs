import * as $stdlib$dict from "../gleam_stdlib/dict.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import {
  CustomType as $CustomType,
  bitArraySlice,
  bitArraySliceToInt,
  BitArray as $BitArray,
  List as $List,
  UtfCodepoint as $UtfCodepoint,
} from "./gleam.mjs";

function is_lowercase_and_numbers(text) {
  if (text === "A") {
    return false;
  } else if (text === "B") {
    return false;
  } else if (text === "C") {
    return false;
  } else if (text === "D") {
    return false;
  } else if (text === "E") {
    return false;
  } else if (text === "F") {
    return false;
  } else if (text === "G") {
    return false;
  } else if (text === "H") {
    return false;
  } else if (text === "I") {
    return false;
  } else if (text === "J") {
    return false;
  } else if (text === "K") {
    return false;
  } else if (text === "L") {
    return false;
  } else if (text === "M") {
    return false;
  } else if (text === "N") {
    return false;
  } else if (text === "O") {
    return false;
  } else if (text === "P") {
    return false;
  } else if (text === "Q") {
    return false;
  } else if (text === "R") {
    return false;
  } else if (text === "S") {
    return false;
  } else if (text === "T") {
    return false;
  } else if (text === "U") {
    return false;
  } else if (text === "V") {
    return false;
  } else if (text === "W") {
    return false;
  } else if (text === "X") {
    return false;
  } else if (text === "Y") {
    return false;
  } else if (text === "Z") {
    return false;
  } else if (text === "a") {
    return true;
  } else if (text === "b") {
    return true;
  } else if (text === "c") {
    return true;
  } else if (text === "d") {
    return true;
  } else if (text === "e") {
    return true;
  } else if (text === "f") {
    return true;
  } else if (text === "g") {
    return true;
  } else if (text === "h") {
    return true;
  } else if (text === "i") {
    return true;
  } else if (text === "j") {
    return true;
  } else if (text === "k") {
    return true;
  } else if (text === "l") {
    return true;
  } else if (text === "m") {
    return true;
  } else if (text === "n") {
    return true;
  } else if (text === "o") {
    return true;
  } else if (text === "p") {
    return true;
  } else if (text === "q") {
    return true;
  } else if (text === "r") {
    return true;
  } else if (text === "s") {
    return true;
  } else if (text === "t") {
    return true;
  } else if (text === "u") {
    return true;
  } else if (text === "v") {
    return true;
  } else if (text === "w") {
    return true;
  } else if (text === "x") {
    return true;
  } else if (text === "y") {
    return true;
  } else if (text === "z") {
    return true;
  } else if (text === "0") {
    return true;
  } else {
    return false;
  }
}

export function main() {
  return echo(is_lowercase_and_numbers("and"), "src\\file_terminal.gleam", 5);
}

function echo(value, file, line) {
  const grey = "\u001b[90m";
  const reset_color = "\u001b[39m";
  const file_line = `${file}:${line}`;
  const string_value = echo$inspect(value);

  if (globalThis.process?.stderr?.write) {
    // If we're in Node.js, use `stderr`
    const string = `${grey}${file_line}${reset_color}\n${string_value}\n`;
    process.stderr.write(string);
  } else if (globalThis.Deno) {
    // If we're in Deno, use `stderr`
    const string = `${grey}${file_line}${reset_color}\n${string_value}\n`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string));
  } else {
    // Otherwise, use `console.log`
    // The browser's console.log doesn't support ansi escape codes
    const string = `${file_line}\n${string_value}`;
    globalThis.console.log(string);
  }

  return value;
}

function echo$inspectString(str) {
  let new_str = '"';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char == "\n") new_str += "\\n";
    else if (char == "\r") new_str += "\\r";
    else if (char == "\t") new_str += "\\t";
    else if (char == "\f") new_str += "\\f";
    else if (char == "\\") new_str += "\\\\";
    else if (char == '"') new_str += '\\"';
    else if (char < " " || (char > "~" && char < "\u{00A0}")) {
      new_str +=
        "\\u{" +
        char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") +
        "}";
    } else {
      new_str += char;
    }
  }
  new_str += '"';
  return new_str;
}

function echo$inspectDict(map) {
  let body = "dict.from_list([";
  let first = true;

  let key_value_pairs = [];
  map.forEach((value, key) => {
    key_value_pairs.push([key, value]);
  });
  key_value_pairs.sort();
  key_value_pairs.forEach(([key, value]) => {
    if (!first) body = body + ", ";
    body = body + "#(" + echo$inspect(key) + ", " + echo$inspect(value) + ")";
    first = false;
  });
  return body + "])";
}

function echo$inspectCustomType(record) {
  const props = globalThis.Object.keys(record)
    .map((label) => {
      const value = echo$inspect(record[label]);
      return isNaN(parseInt(label)) ? `${label}: ${value}` : value;
    })
    .join(", ");
  return props
    ? `${record.constructor.name}(${props})`
    : record.constructor.name;
}

function echo$inspectObject(v) {
  const name = Object.getPrototypeOf(v)?.constructor?.name || "Object";
  const props = [];
  for (const k of Object.keys(v)) {
    props.push(`${echo$inspect(k)}: ${echo$inspect(v[k])}`);
  }
  const body = props.length ? " " + props.join(", ") + " " : "";
  const head = name === "Object" ? "" : name + " ";
  return `//js(${head}{${body}})`;
}

function echo$inspect(v) {
  const t = typeof v;
  if (v === true) return "True";
  if (v === false) return "False";
  if (v === null) return "//js(null)";
  if (v === undefined) return "Nil";
  if (t === "string") return echo$inspectString(v);
  if (t === "bigint" || t === "number") return v.toString();
  if (globalThis.Array.isArray(v))
    return `#(${v.map(echo$inspect).join(", ")})`;
  if (v instanceof $List)
    return `[${v.toArray().map(echo$inspect).join(", ")}]`;
  if (v instanceof $UtfCodepoint)
    return `//utfcodepoint(${String.fromCodePoint(v.value)})`;
  if (v instanceof $BitArray) return echo$inspectBitArray(v);
  if (v instanceof $CustomType) return echo$inspectCustomType(v);
  if (echo$isDict(v)) return echo$inspectDict(v);
  if (v instanceof Set)
    return `//js(Set(${[...v].map(echo$inspect).join(", ")}))`;
  if (v instanceof RegExp) return `//js(${v})`;
  if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
  if (v instanceof Function) {
    const args = [];
    for (const i of Array(v.length).keys())
      args.push(String.fromCharCode(i + 97));
    return `//fn(${args.join(", ")}) { ... }`;
  }
  return echo$inspectObject(v);
}

function echo$inspectBitArray(bitArray) {
  // We take all the aligned bytes of the bit array starting from `bitOffset`
  // up to the end of the section containing all the aligned bytes.
  let endOfAlignedBytes =
    bitArray.bitOffset + 8 * Math.trunc(bitArray.bitSize / 8);
  let alignedBytes = bitArraySlice(
    bitArray,
    bitArray.bitOffset,
    endOfAlignedBytes,
  );

  // Now we need to get the remaining unaligned bits at the end of the bit array.
  // They will start after `endOfAlignedBytes` and end at `bitArray.bitSize`
  let remainingUnalignedBits = bitArray.bitSize % 8;
  if (remainingUnalignedBits > 0) {
    let remainingBits = bitArraySliceToInt(
      bitArray,
      endOfAlignedBytes,
      bitArray.bitSize,
      false,
      false,
    );
    let alignedBytesArray = Array.from(alignedBytes.rawBuffer);
    let suffix = `${remainingBits}:size(${remainingUnalignedBits})`;
    if (alignedBytesArray.length === 0) {
      return `<<${suffix}>>`;
    } else {
      return `<<${Array.from(alignedBytes.rawBuffer).join(", ")}, ${suffix}>>`;
    }
  } else {
    return `<<${Array.from(alignedBytes.rawBuffer).join(", ")}>>`;
  }
}

function echo$isDict(value) {
  try {
    // We can only check if an object is a stdlib Dict if it is one of the
    // project's dependencies.
    // The `Dict` class is the default export of `stdlib/dict.mjs`
    // that we import as `$stdlib$dict`.
    return value instanceof $stdlib$dict.default;
  } catch {
    // If stdlib is not one of the project's dependencies then `$stdlib$dict`
    // will not have been imported and the check will throw an exception meaning
    // we can't check if something is actually a `Dict`.
    return false;
  }
}

