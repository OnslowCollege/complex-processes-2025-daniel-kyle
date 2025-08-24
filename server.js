import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

// Serve index.html and other static files
app.use(express.static("."));

// Read JSON
app.get("/test.json", (req, res) => {
  const data = fs.readFileSync("test.json", "utf8");
  res.send(data);
});

// Write JSON
app.post("/save", (req, res) => {
  fs.writeFileSync("test.json", JSON.stringify(req.body, null, 2));
  res.send("File updated!");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
