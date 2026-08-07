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
app.get("/books/:id",async(req,res)=>{
    const id = req.params.id;
    const result = await db.query(
        "SELECT * FROM reading_history WHERE id = $1",
        [id]
    );
    res.render("book.ejs", {
        book: result.rows[0]
    });
});
const id = req.params.id;

try {
    const result = await db.query(
        "SELECT * FROM reading_history WHERE id = $1",
        [id]
    );

    res.render("edit.ejs", {
        book: result.rows[0]
    });

} catch (err) {
    console.error(err);
    res.status(500).send("Unable to load book.");
}
app.get("/edit/:id",async(req,res)=>{
    const id = req.params.id;
    const rest = await db.query("SELECT * FROM reading_history WHERE id = $1",[id]);
    res.render("edit.ejs",{
        book: rest.rows[0],
    })
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
app.post("/edit/:id",async(req,res)=>{
    const id = req.params.id;
     const isbn = req.body.isbn;
     const title = req.body.title;
     const author = req.body.author;
     const rating = req.body.rating;
     const review = req.body.review;
     const date = req.body.date_read;
     await db.query("UPDATE reading_history SET title = $1,isbn = $2,author = $3,rating = $4,review = $5,date_read = $6 WHERE id = $7",[title,isbn,author,rating,review,date,id]);
    res.redirect(`/books/${id}`);
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });