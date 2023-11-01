import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import pg from "pg";

const db = new pg.Client({
    user : "postgres",
    database : "book-notes",
    host : "localhost",
    password : "my@postgres",
    port : 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true }));

let name = [];
let title = [];

function getJson() {
    fs.readFile("public/book-covers.json", "utf8", (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        title = JSON.parse(data);
        title.forEach(ti => {
            title.push(ti.title);
        });
    });
    return title;
}

async function getDB() {
    const title = getJson();
    const result = await db.query("SELECT * FROM books_data WHERE name LIKE '%' || $1", [title]);
    name = result.rows;
    name.forEach(n => {
        name.push(n.name);
    });
    let getLen = title.length;
    return name + getLen;
}

app.get("/", async (req, res) => {
    console.log(name);
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
});