const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "message is required"],
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow" , "tag"],
      required: [true, "type is required"],
    },
    post_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [3, "name is short"],
      maxlength: [20, "name is long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password is short"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [200, "bio is long"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    savePost: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
    ],
    notification: [notificationSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
