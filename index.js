import express from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
import pg from "pg";
const app = express();
const port = 3000;
app.set("view engine", "ejs");
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
await db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const books = await db.query("SELECT * FROM reading_history");
    res.render("index.ejs",{
        books: books.rows,
        totalBooks : books.rows.length,
    })
});

app.get("/add", async(req,res)=>{
     res.render("add.ejs");
});
app.post("/add", async(req,res)=>{
     console.log(req.body);
     res.redirect("/");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });