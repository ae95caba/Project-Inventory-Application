#! /usr/bin/env node

console.log(
  'This script populates some bikes and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Bike = require("./models/bike");
const Category = require("./models/category");

const bikes = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createBikes();
  await createCategories();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function bikeCreate(
  name,
  numberInStock,
  description,
  price,
  category,
  imgUrl
) {
  const bike = new Bike({
    name: name,
    number_in_stock: numberInStock,
    img_url: imgUrl,
    description: description,
    price: price,
    category: category,
  });
  await bike.save();
  bikes.push(bike);
  console.log(`Added bike: ${name}`);
}

async function categoryCreate(name, description, imgUrl) {
  const category = new Category({
    name: name,
    description: description,
    img_url: imgUrl,
  });

  await category.save();
  categories.push(category);
  console.log(`Added category: ${name} `);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      "Touring",
      "The Touring type of motorcycle is typically larger than most other motorcycles, and it’s meant to have the amenities for cross-country touring to see the beaches on both coasts. They offer a large amount of storage with easy ergonomics that allow you to ride for hours. They will have the largest fairings to block the wind and weather while riding. Engine sizes are typically large to keep up highway speeds and haul a large amount of extra gear and clothes. The first thing you may think of for a Touring motorcycle is the Honda Goldwing. You commonly see them with 100,000 miles on the odometer, and the current owner may be the original owner with some big stories to tell about “that one time when….” They seem to last forever and can be great for a simple trip or a blast for the weekend to see the biggest ball of yarn in the US of A.",
      "https://www.motorcyclelegalfoundation.com/wp-content/uploads/2018/07/Touring-1024x669.png.webp"
    ),
    categoryCreate(
      "Sport bike",
      "The sports genre of motorcycles is meant for speed and agility with forward-leaning ergonomics ready to carve some corners while riding. One of the largest differences with a Sport-typemotorcycle is its weight. They are generally lighter motorcycles made from a lot of aluminum and lighter materials to increase side-to-side maneuverability. The seat height is usually on the higher end to lean the motorcycle farther without scraping foot pegs or fairings. Shorter riders may be on their tiptoes with the taller seat height. Suzuki is considered the starter of this type of motorcycle in the 1980s with the GSXR line-up. Still going strong today, we’d recommend looking at the Suzuki GSXR600 as a good motorcycle for this type. It has enough power to do everything, and with added accessories, it can be made into a comfortable (within reason) weekend sport-touring motorcycle.",
      "https://www.motorcyclelegalfoundation.com/wp-content/uploads/2018/07/Sport-Bike-1024x669.png.webp"
    ),
    categoryCreate(
      "Standard",
      "The standard type of motorcycle is a common favorite because it has a simple design and is suited for all purposes. It has variations from 125cc up to 1,000cc and can be fitted with luggage, a tank bag, and a different seat, and it makes a good first and all-around motorcycle to ride. It doesn’t normally come with a large fairing on the front if it has one at all.",
      "https://www.motorcyclelegalfoundation.com/wp-content/uploads/2018/07/Standard-1024x659.png.webp"
    ),
    categoryCreate(
      "Cruiser",
      "The cruiser, also nicknamed a chopper, was designed for cruising, hence, how it got its name. It typically has a little lower seat height, making it a good “cruising” around-town motorcycle, but with added luggage, it can make a good weekend rider. Again, the engine sizes vary from a small displacement engine to 1,000cc or more, depending on the brand. You may feel more like you’re sitting in a cruiser than on it, but it’s a great option for both new and experienced riders. When you imagine a cruiser (specifically a chopper), Harley-Davidson may be the first brand that comes to mind. We recommend looking at the H-D Low Rider for a good example of a cruiser. It’s a low-slung motorcycle that can travel for miles and has a lot of accessories to make it a great motorcycle for a quick trip or a good weekend out on the road.",
      "https://www.motorcyclelegalfoundation.com/wp-content/uploads/2018/07/Cruiser-1024x669.png.webp"
    ),
    categoryCreate(
      "OFF-ROAD",
      "Off-road motorcycles are exactly what they sound like: for going where no man has been before. They have taller seat heights to accommodate deeper brush and high suspension that can handle a few bumps. They won’t typically have any lights or turn signals, so they will probably be trailered to the weekend riding spot. Most are pretty lightweight and ready to ride the back trails all weekend. Kawasaki makes a good lineup for off-road motorcycles that don’t break the bank. The KLX110 offers a 4-speed transmission with a clutch-less design that will make it easy on the hand and wrist all weekend to climb those steep hills to check out the view.",
      "https://www.motorcyclelegalfoundation.com/wp-content/uploads/2018/07/Off-Road-1024x669.png.webp"
    ),
  ]);
}

async function createBikes() {
  console.log("Adding bikes");
  await Promise.all([
    bikeCreate(
      "Suzuki Gixxer GSX 150",
      5,
      "La Suzuki GSX 150cc es una motocicleta deportiva que combina un diseño elegante con un rendimiento excepcional. Con su motor de 150cc, ofrece potencia y aceleración emocionante, mientras que su chasis ligero y suspensión ajustable brindan una conducción cómoda y estable. Con frenos de disco, iluminación LED y un panel de instrumentos digital, esta moto es la combinación perfecta de estilo y funcionalidad.",
      1000000,
      categories[2],
      "https://motos0km.com.ar/models/suzuki-gsx-150-gixxer-gallery-1c5eab-120180925181322.jpg"
    ),
    bikeCreate(
      "Suzuki GN 125",
      3,
      "La Suzuki GN 125 es una motocicleta clásica y confiable que combina estilo y funcionalidad en un paquete compacto. Con su motor de 125cc, ofrece una conducción suave y eficiente, perfecta para moverse por la ciudad. Su diseño atemporal, con líneas elegantes y detalles cromados, le confiere un aspecto retro y atractivo. Además, cuenta con frenos de disco, suspensión cómoda y un asiento ergonómico, proporcionando comodidad y control en cada viaje. La Suzuki GN 125 es la opción ideal para aquellos que buscan una moto versátil y económica sin sacrificar el estilo clásico.",
      500000,
      categories[2],
      "https://motos0km.com.ar/models/suzuki-gn-125-f-gallery-ff0000-120180925180018.jpg"
    ),
    bikeCreate(
      "Suzuki Gixxer SF 150",
      2,
      "La Gixxer SF 150 de Suzuki es una motocicleta deportiva de alto rendimiento con un diseño vanguardista y agresivo. Equipada con un motor de 150cc, ofrece una potencia emocionante y una aceleración rápida, brindando una experiencia de conducción emocionante. Su carenado aerodinámico y luces LED le dan un aspecto futurista y llamativo, mientras que su chasis ligero y suspensión ajustable proporcionan una conducción ágil y estable. Con frenos de disco y un panel de instrumentos digital, la Gixxer SF 150 combina estilo, rendimiento y funcionalidad en una motocicleta excepcional.",
      1500000,
      categories[1],
      "https://motomaniacs.pe/wp-content/uploads/GIXXER-SF-150-AZUL-1-768x512.webp"
    ),
  ]);
}
