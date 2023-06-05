const Bike = require("../models/bike");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");

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
  const allCategories = await Category.find({}, "name").exec();
  const category = await Category.findById(req.query.category, "name").exec();

  console.log(`the category content is ${category.name}`);

  res.render("bike_form", {
    title: "Create Bike",
    category: category,
    selected_category: undefined,
    bike: undefined,
    errors: undefined,
  });
});

// Handle BookInstance create on POST.
exports.bike_create_post = [
  // Validate body and sanitize fields.
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("stock", "Stock must be specified").isNumeric(),
  body("price", "Price must be specified").isNumeric(),
  body("img_url", "Image url must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  //validate and sanitize query
  query("category").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);

    const selectedCategory = await Category.findById(
      req.query.category,
      "name"
    );
    // Create a BookInstance object with escaped and trimmed data.
    const bike = new Bike({
      name: req.body.name,
      description: req.body.description,
      number_in_stock: req.body.stock,
      price: req.body.price,

      category: selectedCategory,
      img_url: req.body.img_url,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allCategories = await Category.find({}, "name").exec();

      res.render("bike_form", {
        title: "Create Bike",
        category: undefined,

        selected_category: selectedCategory,
        errors: errors.array(),
        bike: bike,
      });
      return;
    } else {
      // Data from form is valid
      await bike.save();
      res.redirect(bike.url);
    }
  }),
];

// Display BookInstance delete form on GET.
exports.bike_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of book instance
  const bike = await Bike.findById(req.params.id).exec();

  if (bike === null) {
    // No results.
    res.redirect("/catalog/bookinstances");
  }

  res.render("bike_delete", {
    bike: bike,
  });
});

// Handle BookInstance delete on POST.
exports.bike_delete_post = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  //  Delete object and redirect to the list of books instances.
  await Bike.findByIdAndRemove(req.params.id);
  res.redirect(`/category/${req.body.categoryid}`);
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
