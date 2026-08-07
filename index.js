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
        const search = req.query.search || "";
        const sort = req.query.sort || "latest";
        let orderBy = "";
        if (sort === "latest") {
            orderBy = "ORDER BY date_read DESC";
        } else if (sort === "rating") {
            orderBy = "ORDER BY rating DESC";
        } else if (sort === "title") {
            orderBy = "ORDER BY title ASC";
        }
        let books;
        if (search) {
            books = await db.query(
                `SELECT *
                 FROM reading_history
                 WHERE title ILIKE $1
                    OR author ILIKE $1
                 ${orderBy}`,
                [`%${search}%`]
            );
        } else {
            books = await db.query(
                `SELECT *
                 FROM reading_history
                 ${orderBy}`
            );
        }
        const average = await db.query(
            "SELECT AVG(rating) AS average_rating FROM reading_history"
        );
        res.render("index.ejs", {
            books: books.rows,
            totalBooks: books.rows.length,
            averageRating: Number(average.rows[0].average_rating).toFixed(1),
            search,
            sort
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to load books.");
    }
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
app.get("/add", async(req,res)=>{
     res.render("add.ejs");
});
app.get("/books/:id",async(req,res)=>{
    try{
    const id = req.params.id;
    const result = await db.query(
        "SELECT * FROM reading_history WHERE id = $1",
        [id]
    );
    if(result.rows.length===0){
        return res.status(404).send("Book not found.");
    }
    res.render("book.ejs", {
        book: result.rows[0]
    });
}catch (err) {
    console.error(err);
    res.status(500).send("Unable to load book.");
}
});
app.get("/edit/:id",async(req,res)=>{
    try{
    const id = req.params.id;
    const rest = await db.query("SELECT * FROM reading_history WHERE id = $1",[id]);
    if(rest.rows.length===0){
        return res.status(404).send("Book not found.");

    }
    res.render("edit.ejs",{
        book: rest.rows[0],
    })
}catch (err) {
    console.error(err);
    res.status(500).send("Unable to edit book.");
}
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
app.post("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(
            "DELETE FROM reading_history WHERE id = $1",
            [id]
        );
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to delete book.");
    }
});
app.post("/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {
            isbn,
            title,
            author,
            rating,
            review,
            date_read
        } = req.body;
        await db.query(
            "UPDATE reading_history SET title = $1, isbn = $2, author = $3, rating = $4, review = $5, date_read = $6 WHERE id = $7",
            [title, isbn, author, rating, review, date_read, id]
        );
        res.redirect(`/books/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to update book.");
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });