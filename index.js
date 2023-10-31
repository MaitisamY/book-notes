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

async function getBooks() {
    
}

app.get("/", async (req, res) => {
    fs.readFile("public/book-covers.json", "utf8", (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        else {
            res.render("index.ejs", {
                data : JSON.parse(data)
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
});