const { bookService, fineService, borrowerService, returnService } = require("../services");
const Fine = require ("../model/fine.model");
// const returnbooks=require('../model/return.model');

module.exports = {
    displayBooks: async (req, res, next) => {
        const books = await bookService.getAllBooks(next);
        console.log(res.locals)
        res.render("pages/books", { books });
    },
    addBookForm: function (req, res, next) {
        res.render('form/add-book');
    },
    addBook: async (req, res, next) => {
        console.log(req.body);
        // there are 2 method save and create to add any entries 
        // const book = new Book(req.body);
        // book.save(function(err, result) {
        //     if (err) throw err;
        //     return res.json(result);
        // })

        try {
            const book = await bookService.addBook(req.body, next);
            res.redirect("/book");
        } catch (e) {
            console.log(e.toString());
        }
        //res.json({message: "book added successfully."});
    },

    purchaseBook: async (req, res, next) => {
        const { bookId } = req.params;
        const userId = req.userId;
        const alreadyPurchased = await borrowerService.findPurchaseBookById(userId, bookId, next);
        if (alreadyPurchased && alreadyPurchased?.active) {
            // then show error
            res.locals.message = "User has already purchased this book";
            return res.redirect("/book");
        }

        const book = await bookService.findBookById(bookId, next);
        if (!book) {
            // then show error
            res.locals.message = `Book id does not exist.`;
            res.redirect("/book");
        }
        if (book && book?.quantity <= 0) {
            // then show error
            res.locals.message = `Not sufficient book: ${book.book_name} to purchase`;
            res.redirect("/book");
        }

        book.quantity -= 1;
        await borrowerService.purchaseBook({ userId, bookId }, next);
        res.locals.message = `Successfully purchased book ${book.book_name}`;
        res.redirect("/user/profile");
    },
    returnBook: async (req, res, next) => {
        
        const userId = req.userId;
        const fine = await Fine.find();
        //   console.log('hello this is fine',fine);
        const { bookId } = req.params;
        const purchasedBook = await borrowerService.findPurchaseBookById(userId, bookId, next);
        const returnbooks=await returnService.findReturnBookById(userId, bookId, next)
        // console.log('purchasedBook', purchasedBook)
        if (purchasedBook && !purchasedBook?.active) {
            // book is already returned
            res.locals.message = "Book is already returned.";
            return res.redirect("/user/profile");
        }

        const book = await bookService.findBookById(bookId, next);
        // console.log('book', book)
        if (!book) {
            // then show error
            res.locals.message = `Book id does not exist or maybe deleted.`;
            res.redirect("/user/profile");
        }

        purchasedBook.active = false;
        // make active:false in borrowerModel
        
        await borrowerService.updateBorrowerBook(userId, bookId, { active: false }, next);

        const date1 = new Date(purchasedBook.purchaseDate);
        const date2 = new Date(25/5/2025);
        const diffTime = Math.abs(date2 - date1);
        
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays)
        const lbfine=Math.abs(diffDays-30);



        // calculate fine
        if (diffDays >= 30) {
            try {

                const as =await fineService.createFine({ userId,amount:lbfine }, next);
                const fine12=await fineService.findFine(userId);
                console.log(fine12);
                res.render("pages/fine",{fine_pay:fine12});

                const fineRecord = await fineService.findFine(userId);
                if (fineRecord && fineRecord.amount == 0) {
                    // Fine is paid, redirect to success page
                    return  await returnService.returnBook({ userId, bookId }, next);
                }
                
            } catch (e) {
                console.log(e)
            }
        
        }
        else{
                await fineService.createFine({ userId }, next); 
                await returnService.returnBook({ userId, bookId }, next);
                res.redirect("/user/profile");

        }
    }
  
}