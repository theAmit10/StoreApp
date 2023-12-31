import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    require: [true, "Please enter email"],
    unique: [true, "Email Already Exists"],
    validator: validator.isEmail,
  },

  password: {
    type: String,
    require: [true, "Please enter password"],
    minLength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  address: {
    type: String,
    required: [true, "Please enter your Address"],
  },
  city: {
    type: String,
    required: [true, "Please enter your city"],
  },
  country: {
    type: String,
    required: [true, "Please enter your country"],
  },
  pinCode: {
    type: Number,
    required: [true, "Please enter your pincode"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: {
    public_id: String,
    url: String,
  },
  otp: Number,
  otp_expire: Date,
});

// below code will work before saving data to the Database
// We are hashing password so that when it got stored in the
// Database than no one will see the real password
// schema.pre("save", async function () {
//   console.log(this.password);
//   const temp = await bcrypt.hash(this.password, 10);
//   this.password = temp;
// });
schema.pre("save", async function (next) {
  // console.log(this.password);
  if(!this.isModified("password")) return next();
  const temp = await bcrypt.hash(this.password, 10);
  this.password = temp;
});

// below method is used to compare the RealPassword with
// Hash Password
// below function will return a boolean value
schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating webtoken so that we can authenticate
schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export const User = mongoose.model("User", schema);
