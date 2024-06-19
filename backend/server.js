const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./todo.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    )
  `);
});

// CRUD Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, completed: false });
  });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  db.run('UPDATE tasks SET title = ?, completed = ? WHERE id = ?', [title, completed, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, title, completed });
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted' });
  });
});

// Download all tasks as PDF
app.get('/api/tasks/download', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const doc = new PDFDocument();
    const filename = 'tasks.pdf';
    const filepath = path.join(__dirname, filename);
    doc.pipe(fs.createWriteStream(filepath));

    rows.forEach(task => {
      doc.text(`Task: ${task.title} - Completed: ${task.completed}`);
    });

    doc.end();

    doc.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        }
        fs.unlink(filepath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  });
});

// Serve static files for the logo
app.use('/logo', express.static(path.join(__dirname, 'logo')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
