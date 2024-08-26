import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Please enter a valid email address."
    },
  },
  password:{
    type: String,
    required: true,
    minlength: 6,
  },
  cPassword:{
    type: String,
  },
  clients : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    }
  ],
  refreshToken: {
    type:String
  }
});

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
};

export const User = mongoose.model("User", userSchema);
