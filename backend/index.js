import express, { json } from 'express'
import cors from "cors"
const app = express()
import mysql from "mysql2/promise"
import 'dotenv/config'

app.use(cors())
app.use(json())


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }

})

// Add user and default libraries
app.post("/api/add-user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (username,password) VALUES (?,?)",
      [username, password]
    );
    const userId = result.insertId;

    const libraries = ["Want to Read", "Current Reads", "Read"];
    for (const name of libraries) {
      await pool.query(
        "INSERT INTO libraries (user_id, name) VALUES (?,?)",
        [userId, name]
      );
    }

    res.json({ message: `${username} added` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user ID
app.get("/api/get-userid", async (req, res) => {
  try {
    const { username, password } = req.query;
    const [rows] = await pool.query(
      "SELECT user_id FROM users WHERE username=? and password=?",
      [username, password]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add book
app.post("/api/add-book", async (req, res) => {
  try {
    const { title, author, cover, user } = req.body;
    await pool.query(
      "INSERT INTO books (title, author, progress, cover, user_id) VALUES (?, ?, 0, ?, ?)",
      [title, author, cover, user]
    );
    res.json({ message: `Book ${title} added successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book progress
app.post("/api/update-progress", async (req, res) => {
  try {
    const { title, progress, user } = req.body;
    await pool.query(
      "UPDATE books SET progress = ? WHERE title = ? AND user_id=?",
      [progress, title, user]
    );

    if (progress === "100") {
      const [[book]] = await pool.query(
        "SELECT book_id FROM books WHERE title = ? AND user_id=?",
        [title, user]
      );
      const [[library]] = await pool.query(
        "SELECT library_id FROM libraries WHERE name=? AND user_id=?",
        ["Read", user]
      );

      if (book && library) {
        await pool.query(
          "UPDATE library_books SET library_id=? WHERE book_id=?",
          [library.library_id, book.book_id]
        );
      }

      res.json({ message: "Progress updated and moved to Read" });
    } else {
      res.json({ message: "Progress updated" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add book to library
app.post("/api/add-to-library", async (req, res) => {
  try {
    const { userId, title, libraryName } = req.body;
    const [[book]] = await pool.query(
      "SELECT book_id FROM books WHERE title = ? AND user_id = ?",
      [title, userId]
    );
    const [[library]] = await pool.query(
      "SELECT library_id FROM libraries WHERE name = ? AND user_id = ?",
      [libraryName, userId]
    );

    if (book && library) {
      await pool.query(
        "INSERT INTO library_books (library_id, book_id) VALUES (?,?)",
        [library.library_id, book.book_id]
      );
      res.json({ message: `Book ${title} added to ${libraryName}` });
    } else {
      res.status(404).json({ error: "Book or library not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get books in a library
app.get("/api/get-library-books", async (req, res) => {
  try {
    const { libraryName, userId } = req.query;
    const [[library]] = await pool.query(
      "SELECT library_id FROM libraries WHERE name = ? AND user_id = ?",
      [libraryName, userId]
    );

    if (!library) {
      return res.status(404).json({ error: "Library not found" });
    }

    const [books] = await pool.query(
      `SELECT * 
       FROM books 
       JOIN library_books ON books.book_id=library_books.book_id 
       JOIN libraries ON library_books.library_id=libraries.library_id 
       WHERE libraries.library_id=? AND books.user_id=?`,
      [library.library_id, userId]
    );

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

