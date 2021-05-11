const express = require('express');
const router = express.Router();

const { Book } = require('../models');

const asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
};

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('/books');
});

router.get(
    '/books',
    asyncHandler(async (req, res, next) => {
        // Shows the full list of books
        const books = await Book.findAll();
        res.render('book/index', { books });
    })
);

router.get('/books/new', (req, res, next) => {
    res.render('book/new', { book: {} });
});

router.post(
    '/books/new',
    asyncHandler(async (req, res, next) => {
        let book;
        try {
            book = await Book.create(req.body);
            res.redirect('/books');
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                book = await Book.build(req.body);
                res.render('book/new', {
                    book,
                    errors: error.errors
                });
            } else {
                throw error;
            }
        }
    })
);

router.get(
    '/books/:id',
    asyncHandler(async (req, res, next) => {
        const book = await Book.findByPk(req.params.id);
        res.render('book/update', { book });
    })
);

router.post(
    '/books/:id',
    asyncHandler(async (req, res, next) => {
        let book = await Book.findByPk(req.params.id);
        try {
            book = await book.update(req.body);
            res.redirect('/books');
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                book = await Book.build(req.body);
                res.render('book/update', {
                    book,
                    errors: error.errors
                });
            } else {
                throw error;
            }
        }
    })
);

router.post(
    '/books/:id/delete',
    asyncHandler(async (req, res, next) => {
        // Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting

        const books = await Book.findAll();
        res.json(books);
    })
);

module.exports = router;
