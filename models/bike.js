const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BikeSchema = new Schema({
  name: { type: String, required: true },
  number_in_stock: {
    type: Number,
    required: true,
  },
  img_url: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

// Virtual for book's URL
BikeSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `catalog/motorcycles/${this._id}`;
  /* 	return `catalog/${this.category}/${this._id}`; */
});

// Export model
module.exports = mongoose.model("Bike", BikeSchema);
