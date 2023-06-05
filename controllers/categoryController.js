const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const Bike = require("../models/bike");

const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Author List",
    category_list: allCategories,
  });
});

// Display detail page for a specific Author.
exports.category_detail = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  // Get details of author and all their books (in parallel)
  const [category, allBikesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bike.find({ category: req.params.id }, "name img_url").exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_bikes: allBikesInCategory,
  });
});

// Display Author create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {
    title: "Create Category",
    category: undefined,
    errors: undefined,
  });
};

// Handle Author create on POST.
exports.category_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),
  body("img_url")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Image url must be specified."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      img_url: req.body.img_url,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save category.
      await category.save();
      // Redirect to new category record.
      res.redirect(category.url);
    }
  }),
];

// Display Author delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Handle Author delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.

    //both ways are valid

    console.log(`el id es :${req.params.id}`);
    await Author.findByIdAndRemove(req.params.id);

    res.redirect("/catalog/authors");
  }
});

// Display book update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const author = await Author.findById(req.params.id).exec();
  console.log(`the author is : ${author}`);

  if (author === null) {
    // No results.
    const err = new Error("author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_form", {
    title: "Update Author",
    author: author,
  });
});

// Handle Author update on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Update Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const theauthor = await Author.findByIdAndUpdate(
        req.params.id,
        author,
        {}
      );
      // Redirect to author detail page.
      res.redirect(theauthor.url);
    }
  }),
];
