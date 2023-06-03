const Bike = require("../models/bike");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all bikes.
exports.bike_list = asyncHandler(async (req, res, next) => {
  const allBikes = await Bike.find().sort({ name: 1 }).exec();

  res.render("bike_list", {
    title: "Bike List",
    bike_list: allBikes,
  });
});

// Display detail page for a specific Bike.
exports.bike_detail = asyncHandler(async (req, res, next) => {
  const bike = await Bike.findById(req.params.id).exec();

  if (bike === null) {
    // No results.
    const err = new Error("Bike not found");
    err.status = 404;
    return next(err);
  }

  res.render("bike_detail", {
    title: "Bike:",
    bike: bike,
  });
});

// Display BookInstance create form on GET.
exports.bike_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").exec();

  res.render("bookinstance_form", {
    title: "Create BookInstance",
    book_list: allBooks,
  });
});

// Handle BookInstance create on POST.
exports.bike_create_post = [
  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await Book.find({}, "title").exec();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      // Data from form is valid
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

// Display BookInstance delete form on GET.
exports.bike_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of book instance
  const bookInstance = await BookInstance.findById(req.params.id).exec();

  console.log(`el id the la instancia es : ${bookInstance}`);
  console.log(`el id the la instancia es : ${bookInstance}`);

  if (bookInstance === null) {
    // No results.
    res.redirect("/catalog/bookinstances");
  }

  res.render("bookinstance_delete", {
    title: "Delete Book instance",

    book_instance: bookInstance,
  });
});

// Handle BookInstance delete on POST.
exports.bike_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of book instances
  const bookInstance = await BookInstance.findById(req.params.id).exec();

  //  Delete object and redirect to the list of books instances.
  await BookInstance.findByIdAndRemove(req.body.book_instanceid);
  res.redirect("/catalog/bookinstances");
});

// Display bookinstance update form on GET.
exports.bike_update_get = asyncHandler(async (req, res, next) => {
  // Get bookinstance and authors for form.
  const [bookinstance, books] = await Promise.all([
    BookInstance.findById(req.params.id).exec(),
    Book.find().exec(),
  ]);
  console.log(`the bookinstance is : ${bookinstance}`);
  if (bookinstance === null) {
    // No results.
    const err = new Error("Book instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_form", {
    title: "Update Book instance",
    book_list: books,
    selected_book: bookinstance.book._id,
    bookinstance: bookinstance,
  });
});

// Handle BookInstance update on POST.
exports.bike_update_post = [
  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await Book.find({}, "title").exec();

      console.log(`selected book is :${bookInstance.book._id}`);

      res.render("bookinstance_form", {
        title: "Update BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const thebookinstance = await BookInstance.findByIdAndUpdate(
        req.params.id,
        bookInstance,
        {}
      );
      // Redirect to book detail page.
      res.redirect(thebookinstance.url);
    }
  }),
];
