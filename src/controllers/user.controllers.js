import { User } from "../models/user.models.js";

import bcryptjs from "bcryptjs";

const generateAccessAndRefreshToken = async (userId) =>{
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return { accessToken, refreshToken }

  } catch (error) {
    return (error.message)
  }
}

const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, cPassword } = req.body;
    const existedUserName = await User.findOne({ username: username});
    const existedEmail = await User.findOne({email:email})
    
    if(existedEmail && existedUserName) {
      return res.status(400).json({ message: "Email and username already exists. Kindly Login" });  // Check if email and username already exists or not
    }
    if(existedEmail){
      return res.status(400).json({ message: "Email already exists" });  // Check if email already exists or not
    }
    if (existedUserName) {
      return res.status(400).json({ message: "Username is already exists.Try another one" });
    }
    
    if(password.length<6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });  // Check if password length is more than 6 or not
    }

    if (password !== cPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await  User.create({
      email: email,
      fullName: fullName,
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
     
   
    if(!createdUser) {
      return res.status(400).json({ message: "User can't register successfully" });  // Check if user created successfully or not
    }
    res.status(201).json({ message: "User created successfully",data:createdUser });
    
    
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Cannot create user" });
  }
};

const login = async (req,res) => {
  try {
    const {username, password} = req.body;
  
    const user =  await User.findOne({username:username});
    if(!user){
      return res.status(401).json({message: "user not found please register user"})
    }
    const isPasdwordCorrect = await bcryptjs.compare(password,user.password);

    if (!isPasdwordCorrect){
      return res.status(401).json({message: "Password incorrect"})
    }
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({ message:"User Loggedin Successfully",user:logedInUser,accessToken:accessToken,refreshToken:refreshToken});

  }
   catch (error) {
    res.status(400).json({message:"Cannot login user"})
  }
}

const logout = async (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{refreshToken:undefined}
      },
      {
        new: true,
      }
    )
    const options = {
      httpOnly: true,
      secure: true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User Logged Out Successfully" });
  } catch (error) {
    return res.status(500).json({message:"user can't logout"})
  }
}

const changePassword = async (req, res) => {
    try {
      const {oldPassword, newPassword} = req.body;

      const user = await User.findById(req.user?._id)

      const isCorrectPassword = await bcryptjs.compare(oldPassword,user.password)
      if(!isCorrectPassword){
        return res.status(400).json({message: "Incorrect Old Password"})
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10); 
      user.password = hashedPassword; 
      await user.save({validateBeforeSave:false});

      return res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
      return res.status(400).json({message: "Can't change password"})
    }
}

const getCurrentUserr =  async(req,res) => {
  try {
    const user=  req.user
    if(!user) {
      return res.status(404).json({ message: "User not found" });  // Check if user exists or not
    }
    return res.status(200).json({user})
  } catch (error) {
    return res.status(500).json({message:"can't fetche user"})
  }
}


export { signup, login, logout, changePassword, getCurrentUserr }