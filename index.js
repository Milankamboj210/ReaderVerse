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
    try {
        const books = await db.query(
            "SELECT * FROM reading_history"
        );
        const average = await db.query(
            "SELECT AVG(rating) AS average_rating FROM reading_history"
        );
        res.render("index.ejs", {
            books: books.rows,
            totalBooks: books.rows.length,
            averageRating: Number(average.rows[0].average_rating).toFixed(1),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to load books.");
    }
});

app.get("/add", async(req,res)=>{
     res.render("add.ejs");
});
app.post("/add", async(req,res)=>{
    const {
        isbn,
        title,
        author,
        rating,
        review,
        date_read
    } = req.body;
    try{
    const result = await db.query(
        "INSERT INTO reading_history(isbn,title,author,rating,review,date_read) VALUES ($1,$2,$3,$4,$5,$6)",
        [isbn, title, author, rating, review, date_read]
      );
     res.redirect("/");
    }catch (err) {

        console.error(err);
    
        res.status(500).send("Unable to add book.");
    
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });