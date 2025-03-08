const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((con) => {
      console.log("Data Base id ready");
    })
    .catch((e) => {
      console.log(`Error Data Base ${e.message}`);
    });
};

module.exports = { connectDB };
