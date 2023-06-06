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
  const [category, allBikesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bike.find({ category: req.params.id }, "name").exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/categories");
  }

  res.render("category_delete", {
    title: "Delete category",
    category: category,
    category_bikes: allBikesInCategory,
  });
});

// Handle Author delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [bike, allBikesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bike.find({ category: req.params.id }, "name details").exec(),
  ]);

  if (allBikesInCategory.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author_delete", {
      title: "Delete Category",
      category: category,
      category_bikes: allBikesInCategory,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.

    //both ways are valid

    console.log(`el id es :${req.params.id}`);
    await Category.findByIdAndRemove(req.params.id);

    res.redirect("/");
  }
});

// Display book update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results.
    const err = new Error("category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
    errors: undefined,
  });
});

// Handle Author update on POST.
exports.category_update_post = [
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
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Update Category", //second change in relation to change book
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      //third change in realtion to change book
      // Data from form is valid. Update the record.
      const thecategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      // Redirect to book detail page.
      res.redirect(thecategory.url);
    }
  }),
];
