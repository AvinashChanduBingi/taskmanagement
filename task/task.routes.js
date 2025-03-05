const express = require("express");
const router = express.Router();
const taskController = require("./tasks.controller");

router.post("/addtask",(req,res)=>tasksController.addTask(req,res));
router.get("/",(req,res)=>taskController.getTasks(req,res));
router.post("/insertmanytasks",(req,res)=>taskController.addMultipleTasks(req,res));
router.get("/pendingtasks",(req,res)=>taskController.getPendingTasks(req,res));
router.get("/getSummary",(req,res)=>taskController.getSummary(req,res));




router.get("/:id",(req,res)=>taskController.getTaskById(req,res));
module.exports = router;