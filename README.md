# 📚 ReaderVerse

ReaderVerse is a full-stack web application that allows users to build and manage their personal reading library. Users can add books, write reviews, rate them, search their collection, and organize their reading history through a clean and intuitive interface.

## 🚀 Live Demo

🌐 https://readerverse-3.onrender.com/

## 📌 Features

- 📖 Add new books to your reading library
- ✏️ Edit existing book details
- 🗑️ Delete books from your collection
- ⭐ Rate books
- 📝 Write personal reviews
- 🔍 Search books by title or author
- 📅 Sort books by latest read date
- ⭐ Sort by highest rating
- 🔤 Sort alphabetically
- 📊 Dashboard displaying:
  - Total books read
  - Average rating
- 📱 Responsive and modern UI

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- EJS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL (Neon)

### Deployment
- Render

---

## 📂 Project Structure

```
ReaderVerse
│
├── public/
│   ├── css/
│   └── assets/
│
├── views/
│   ├── partials/
│   ├── index.ejs
│   ├── add.ejs
│   ├── edit.ejs
│   ├── book.ejs
│   └── about.ejs
│
├── index.js
├── package.json
├── .env
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Milankamboj210/ReaderVerse.git
```

### Navigate to the project

```bash
cd ReaderVerse
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
DB_USER=your_database_user
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
```

### Run the application

```bash
npm start
```

Open:

```
http://localhost:3000
```

---

## 💾 Database

ReaderVerse uses **PostgreSQL** as its primary database.

The application stores:

- Book ISBN
- Title
- Author
- Rating
- Review
- Date Read

---

## 📖 Future Improvements

- User Authentication
- Reading Goals
- Dark Mode
- Pagination
- Book Categories & Tags
- Reading Statistics & Charts
- Cover Image Upload
- Favorite Books
- Reading Progress Tracking

---

## 👨‍💻 Developer

**Milan Kamboj**

B.Tech Computer Science & Artificial Intelligence

GL Bajaj Institute of Technology & Management

---

## 📜 License

This project is intended for educational and portfolio purposes.