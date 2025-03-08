const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/connectDB");
const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./utils/ApiError");
const postRoute = require("./routes/postRoutes");
const fileRoute = require("./routes/fileRoutes");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const interactionRoute = require("./routes/interactionsRoutes");

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect Data Base
connectDB();

app.use("/api/v1/post", postRoute);

app.use("/api/v1/upload", fileRoute);

app.use("/api/v1/user", userRoute);

app.use("/api/v1/", authRoute);

app.use("/api/v1/", interactionRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`route in not correct ${req.originalUrl}`, 400));
});

app.use(errorHandler);

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`server is ready on port ${port}`);
});
