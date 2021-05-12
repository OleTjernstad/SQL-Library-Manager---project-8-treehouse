const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

const { Book } = require('../models');

/**
 * AsyncHandler to add try catch to routes
 * @param {function} cb CallBack Function to run
 * @returns
 */
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

/**
 * Redirect to books route
 */
router.get('/', (req, res, next) => {
    res.redirect('/books');
});

/**
 * Load list of all books
 */
router.get(
    '/books',
    asyncHandler(async (req, res, next) => {
        const books = await Book.findAll();
        res.render('book/index', { books });
    })
);

/**
 * Load book list from search
 */
router.post(
    '/books',
    asyncHandler(async (req, res, next) => {
        const Op = Sequelize.Op;
        const { search } = req.body;
        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.substring]: search } },
                    { author: { [Op.substring]: search } },
                    { genre: { [Op.substring]: search } },
                    { year: { [Op.substring]: search } }
                ]
            }
        });

        res.render('book/index', { books });
    })
);

/**
 * Render new book form
 */
router.get('/books/new', (req, res, next) => {
    res.render('book/new', { book: {} });
});

/**
 * Handle post request from new book form
 */
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

/**
 * Render update book form
 */
router.get(
    '/books/:id',
    asyncHandler(async (req, res, next) => {
        const book = await Book.findByPk(req.params.id);
        res.render('book/update', { book });
    })
);

/**
 * Handle post request from update book form
 */
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

/**
 * Render confirm delete book page
 */
router.get(
    '/books/:id/delete',
    asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        res.render('book/delete', { book });
    })
);

/**
 * Handle post request for delete book
 */
router.post(
    '/books/:id/delete',
    asyncHandler(async (req, res, next) => {
        const books = await Book.findByPk(req.params.id);
        await books.destroy();
        res.redirect('/books');
    })
);

module.exports = router;
