import { asyncError } from "../middleware/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import {
  cookieOptions,
  getDataUri,
  sendEmail,
  sendToken,
} from "../utils/features.js";
import cloudinary from "cloudinary";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect Email or password" });
  }

  if (!password) return next(new ErrorHandler("Please enter password", 400));

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect email or Password", 400));
  }

  // const token = user.generateToken();

  // res
  //   .status(200)
  //   .cookie("token", token, {
  //     expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  //   })
  //   .json({
  //     success: true,
  //     message: `Welcome Back, ${user.name}`,
  //     token,
  //   });

  sendToken(user, res, `Welcome Back, ${user.name}`, 200);
});

export const signup = asyncError(async (req, res, next) => {
  const { name, email, password, address, city, country, pinCode } = req.body;

  // check user is already registered or not
  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User Already email Exist", 400));

  // For Uploading Profile Image
  // we can access image by req.file

  let avatar = undefined;

  if (req.file) {
    // console.log(req.file);
    const file = getDataUri(req.file);
    // console.log(file);

    // Adding image to cloundinary
    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    console.log(myCloud);
    console.log(myCloud.secure_url);

    avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  user = await User.create({
    avatar,
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
  });

  // sendToken(user, res, `Register Succesfully`, 201);

  const token = user.generateToken();
  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: `Welcome Back, ${user.name}`,
      token,
    });

  // res.status(201).json({
  //   success: true,
  //   message: "Registered Successfully",
  // });

  // res.send("Register User");
});

export const getMyProfile = asyncError(async (req, res, next) => {
  // res.send("Working Profile")

  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const logOut = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logout Successfully...",
    });
});

export const updateProfile = asyncError(async (req, res, next) => {
  // res.send("Working Profile")

  const user = await User.findById(req.user._id);

  const { name, email, address, city, country, pinCode } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (city) user.city = city;
  if (country) user.country = country;
  if (pinCode) user.pinCode = pinCode;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  // res.send("Working Profile")

  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(
      new ErrorHandler("Please enter oldpassword & new password", 400)
    );

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) return next(new ErrorHandler("Incorrect Old Password"));

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Success",
  });
});

export const checkMyProfile = async (req, res, next) => {
  // res.send("Working Profile");

  res.status(200).json({
    success: true,
    message: "Password Changed Success",
  });
};

// Update Pic
export const updatePic = asyncError(async (req, res, next) => {
  // res.send("Working Profile")

  const user = await User.findById(req.user._id);

  const file = getDataUri(req.file);

  // Adding image to cloundinary
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Pic Updated Successfully",
  });
});

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Incorrect Email Address", 404));

  // max,min 2000,10000
  // below formula is used to get get a number
  // between the max and min valuse
  // math.random()*(max-min)+min

  const randomNumber = Math.random() * (999999 - 100000) + 100000;
  const otp = Math.floor(randomNumber);
  const otp_expire = 15 * 60 * 1000;

  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);

  await user.save();

  console.log("OTP :: " + otp);
  const message = `Your OTP For Reseting Password is ${otp}.\n Please Ignore if you have'nt requested this.`;

  try {
    await sendEmail("OTP For Reseting Password", user.email, message);
  } catch (error) {
    user.otp = null;
    user.otp_expire = null;
    await user.save();
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: `Email Sent to ${user.email}`,
  });
};

export const resetPassword = async (req, res, next) => {
  const { otp, password } = req.body;

  const user = await User.findOne({
    otp,
    otp_expire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(new ErrorHandler("Incorrect OTP or has been expired", 400));

  if (!password)
    return next(new ErrorHandler("Please Enter New Password", 400));
  user.password = password;
  user.otp = undefined;
  user.otp_expire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully, You can login now",
  });
};
