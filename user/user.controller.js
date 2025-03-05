const { userModel, userValidation } = require("./user.model");
const CustomError = require("../Custom.error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

class Usercontoller {
  /**
   * description : Getting all the user details
   * @param {*} req
   * @param {*} res
   */
  async getUsers(req, res) {
    try {
      console.log("Inside UserController class getUsers method ");
      const data = await userModel.find();
      if (!data) throw new CustomError("Error While Fetching the data", 500);
      res.status(200).json({
        status: true,
        message: "Data successfully retrived",
        data: data,
      });
    } catch (error) {
      console.log("Error Inside UserController class getUsers method ");
      if (error instanceof CustomError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: err.message });
    }
  }

  /**
   * Description Gets the user data by the Id
   * @param {*} req
   * @param {*} res
   * @returns user data By Id
   */
  async getUserById(req, res) {
    try {
      console.log("Inside UserController class getUserById method ");
      const user = await userModel.findById(req.params.id);
      if (!user) throw new CustomError("User Not Found", 404);
      res
        .status(200)
        .json({ status: true, message: "User Data Found", data: user });
    } catch (error) {
      console.log("Error Inside UserController class getUserById method ");
      if (error instanceof CustomError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      console.log("In Usercontroller class updateUserById");
      await userValidation.validateAsync(req.body);
      req.body.updateUserById = Date.now();
      const saved = await userModel.updateOne({ _id: req.params.id }, req.body);
      if (!saved) throw new CustomError("Error While Updatind data", 500);
      res.status(200).json({ status: true, message: "User Profile Updated" });
    } catch (error) {
      console.log(
        "Error Inside UserController class updateUserById method " + error
      );
      if (error instanceof CustomError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
  async updateStatus(req,res)
  {
    try {
        console.log("IN UserController class updateStatus Method");
        const statusUpdate = await userModel.updateOne({_id:req.body._id},{$set :{status : req.body.status}});
        if(!statusUpdate) throw new CustomError("Error While updating status",500);
        res.status(200).json({
            status : true,
            message : "Status updated"
        })
    } catch (error) {
        console.log(
            "Error Inside UserController class updateStatus method " + error
          );
          if (error instanceof CustomError)
            return res
              .status(error.code)
              .json({ status: false, message: error.message });
          res.status(500).json({ status: false, message: error.message });
    }
  }
}
module.exports = new Usercontoller();
