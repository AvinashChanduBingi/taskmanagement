const express = require('express');
const router = express.Router();
const userRouter = require("../user/user.routes");
const authRouter = require("../authentication/authenticate.routes");
const taskRouter = require("../task/task.routes");
const authenticateClass = require("../authentication/authenticate");
const authenticate = authenticateClass.authenticate;

router.use("/users",(req,res,next)=>authenticate(req,res,next),userRouter);
router.use("/tasks",(req,res,next)=>authenticate(req,res,next),taskRouter);
router.use("/auth",authRouter);


module.exports = router;