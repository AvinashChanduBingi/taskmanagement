const jwt = require("jsonwebtoken");
require("dotenv").config();
const { userModel, userValidation } = require("../user/user.model");
const bcrypt = require("bcrypt");
const CustomError = require("../Custom.error");

class authenticate {
  async authenticate(req, res, next) {
    try {
      console.log("In JWT Token Authentication Method");
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.status(401).json({
          status: false,
          message: "Invalid or No Bearer token avilable",
        });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(409).json({
          status: false,
          message: "Token Not Present",
        });
      }
      jwt.verify(token, process.env.SIGNATURE, function (err, response) {
        try {
          if (response) {
            req.user = response.user;
            next();
          } else {
            return res.status(401).json({
              status: false,
              message: err.message,
            });
          }
        } catch (error) {
          return res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      });
    } catch (error) {
      console.log(
        "Error In Authenticate class : JWT verfication Method" + error
      );
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async login(req, res) {
    try {
      console.log("Inside Authenticate Class : Login Method");
      const { email, password } = req.body;
      const user = await userModel.findOne({ email: email });
      if (!user) throw new CustomError("User Not Found", 404);
      if (bcrypt.compare(password, user.password)) {
        console.log(user._id.toString());
        await userModel.updateOne(
          { _id: user._id }, 
          { $set: { lastLoginAt: Date.now() } }
      );
              let token = jwt.sign({ user: user }, process.env.SIGNATURE);
        res.status(200).json({
          message: "User Logged In",
          status: true,
          token: token,
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid Password",
        });
      }
    } catch (error) {
      console.log("Error Inside Authenticate Class : Login Method " + error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          status: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      }
    }
  }
  async register(req, res) {
    try {
      console.log("Inside Authenticate Class Register Method");
      bcrypt.hash(req.body.password, 10, function (err, password) {
        if (password) {
          req.body.password = password;
        } else {
          console.log(err);
        }
      });
      await userValidation.validateAsync(req.body);
      const user = new userModel(req.body);
      const save = await user.save();
      if (!save) throw new CustomError("Error Registering Employee", 500);
      res
        .status(200)
        .json({ status: true, message: "User Successfully Registered" });
    } catch (error) {
      console.log("Error inside AUtheticate class register method" + error);
      if (error instanceof CustomError) {
        res.status(error.code).json({ status: false, message: error.message });
      } else {
        res.status(500).json({ status: false, message: error.message });
      }
    }
  }
}
module.exports = new authenticate();
