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

    // fs.readFile("public/book-covers.json", "utf8", (error, data) => {
    //     if (error) {
    //       console.log(error);
    //       return;
    //     }
    //     title = JSON.parse(data);
    //     title.forEach(ti => {
    //         title.push(ti.title);
    //     });
    // });

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM books_data ORDER BY CASE rating WHEN '10' THEN 1 WHEN '9' THEN 2 WHEN '8' THEN 3 WHEN '7' THEN 4 WHEN '6' THEN 5 WHEN '5' THEN 6 WHEN '4' THEN 7 WHEN '3' THEN 8 WHEN '2' THEN 9 ELSE 10 END");
    res.render("index.ejs", {
        data : result.rows
    });
});

app.get("/book/:isbn", async (req, res) => {
    const isbn = req.params['isbn'];
    console.log(isbn);
    const result = await db.query("SELECT * FROM books_data WHERE isbn = $1", [isbn]);
    res.render("book.ejs", {
        data : result.rows
    });
});

app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
});