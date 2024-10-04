const express = require('express');
const router = express.Router();

let books = []; // In-memory book database

// CREATE a new book
router.post('/', (req, res) => {
    const { id, title, author } = req.body;
    books.push({ id, title, author });
    res.status(201).json({ message: 'Book created', book: { id, title, author } });
});

// READ all books
router.get('/', (req, res) => {
    res.status(200).json(books);
});

// READ a specific book by ID
router.get('/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
});

// UPDATE a book by ID
router.put('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });

    const { title, author } = req.body;
    books[bookIndex] = { id: parseInt(req.params.id), title, author };
    res.status(200).json({ message: 'Book updated', book: books[bookIndex] });
});

// DELETE a book by ID
router.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });

    books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Book deleted' });
});

module.exports = router;
