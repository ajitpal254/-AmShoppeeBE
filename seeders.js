const mongoose = require("mongoose");
const dotenv = require("dotenv");
const users = require("./data/user");
const user = require("./models/user");
const Product = require("./models/ProductModel");
const order = require("./models/OrderModel");
const products = require("./data/products");

const connectDB = require("./config/db");
require("colors");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await order.deleteMany();
    await Product.deleteMany();
    await user.deleteMany();

    console.log("Users to import:", users);
    const createUser = await user.insertMany(users);
    const adminUser = createUser[0]._id;
    const sampleData = products.map((product) => {
      return { ...product, user: adminUser };
    });
    await Product.insertMany(sampleData);
    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

const dataDestroy = async () => {
  try {
    await order.deleteMany();
    await Product.deleteMany();
    await user.deleteMany();
    console.log("Data Destroyed".red);
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

if (process.argv[2] == "-d") {
  dataDestroy();
} else {
  importData();
}
