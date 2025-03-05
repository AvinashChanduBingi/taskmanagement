const express = require("express");
const userRouter = express.Router();
const userController = require("./user.controller");

userRouter.get("/",(req,res)=>userController.getUsers(req,res));
userRouter.get("/:id",(req,res)=>userController.getUserById(req,res));
userRouter.put("/:id",(req,res)=>userController.updateUserProfile(req,res));
userRouter.patch("/statusupdate",(req,res)=>userController.updateStatus(req,res));
module.exports = userRouter;