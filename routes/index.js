const express = require('express');
const router = express.Router();

const { Book } = require('../models');

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.redirect('/books');
});

router.get('/books', async (req, res, next) => {
    // Shows the full list of books
    const books = await Book.findAll();
    res.json(books);
});

router.get('/books/new', async (req, res, next) => {
    // Shows the create new book form
    const books = await Book.findAll();
    res.json(books);
});

router.post('/books/new', async (req, res, next) => {
    // Posts a new book to the database
    const books = await Book.findAll();
    res.json(books);
});

router.get('/books/:id', async (req, res, next) => {
    // Shows book detail form
    const books = await Book.findAll();
    res.json(books);
});

router.post('/books/:id', async (req, res, next) => {
    // Updates book info in the database
    const books = await Book.findAll();
    res.json(books);
});

router.post('/books/:id/delete', async (req, res, next) => {
    // Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting

    const books = await Book.findAll();
    res.json(books);
});

module.exports = router;
