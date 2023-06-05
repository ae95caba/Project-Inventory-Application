const express = require("express");
const router = express.Router();

// Require controller modules.
const bike_controller = require("../controllers/bikeController");
const category_controller = require("../controllers/categoryController");

/// bike ROUTES ///

// GET catalog home page.

// GET request for creating a bike. NOTE This must come before routes that display bike (uses id).
router.get("/bike/create", bike_controller.bike_create_get);

// POST request for creating bike.
router.post("/bike/create", bike_controller.bike_create_post);

// GET request to delete bike.
router.get("/bike/:id/delete", bike_controller.bike_delete_get);

// POST request to delete bike.
router.post("/bike/:id/delete", bike_controller.bike_delete_post);

// GET request to update bike.
router.get("/bike/:id/update", bike_controller.bike_update_get);

// POST request to update bike.
router.post("/bike/:id/update", bike_controller.bike_update_post);

// GET request for one bike.
router.get("/bike/:id", bike_controller.bike_detail);

// GET request for list of all bike items.
router.get("/bikes", bike_controller.bike_list);

/// AUTHOR ROUTES ///

// GET request for list of all categorys.
router.get("/", category_controller.category_list);

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

module.exports = router;
