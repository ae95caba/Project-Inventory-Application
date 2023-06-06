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

  res.render("bike_form", {
    title: "Create Bike",
    category: category,

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

    // Create a BookInstance object with escaped and trimmed data.
    const bike = new Bike({
      name: req.body.name,
      description: req.body.description,
      number_in_stock: req.body.stock,
      price: req.body.price,

      category: req.query.category,
      img_url: req.body.img_url,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allCategories = await Category.find({}, "name").exec();

      res.render("bike_form", {
        title: "Create Bike",
        category: bike.category,

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
  const bike = await Bike.findById(req.params.id).exec();

  if (bike === null) {
    // No results.
    const err = new Error("Book instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("bike_form", {
    title: "Update bike",

    category: bike.category._id,
    bike: bike,
    errors: undefined,
  });
});

// Handle BookInstance update on POST.
exports.bike_update_post = [
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

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);
    console.log(errors);

    // Create a BookInstance object with escaped and trimmed data.
    const bike = new Bike({
      name: req.body.name,
      description: req.body.description,
      number_in_stock: req.body.stock,
      price: req.body.price,

      category: req.query.category,
      img_url: req.body.img_url,
      //first change in relation to create book
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allCategories = await Category.find({}, "name").exec();

      res.render("bike_form", {
        title: "Update Bike", //second change in relation to change book
        category: bike.category,

        errors: errors.array(),
        bike: bike,
      });
      return;
    } else {
      //third change in realtion to change book
      // Data from form is valid. Update the record.
      const thebike = await Bike.findByIdAndUpdate(req.params.id, bike, {});
      // Redirect to book detail page.
      res.redirect(thebike.url);
    }
  }),
];
