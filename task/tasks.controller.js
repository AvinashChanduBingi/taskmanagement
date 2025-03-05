const { taskModel, taskValidation } = require("./task.model");
const customError = require("../Custom.error");
const moment = require("moment");

class taskController {
  async addTask(req, res) {
    try {
      console.log("Inside taskController class addTask method");

      if (moment(req.body.dueDate).isBefore(moment().add(1, "hour")))
        throw new customError(
          "Minimum Time required for task is one hour",
          500
        );
      req.body.createdAt = Date.now();
      const model = new taskModel(req.body);
      const saved = await model.save();
      if (!saved) throw new customError("Error While Saving the data", 500);
      res.status(200).json({
        status: true,
        message: "Data saved Successfully",
      });
    } catch (error) {
      console.log("Error Inside taskController class addTask method " + error);
      if (error instanceof customError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
  async getTaskById(req, res) {
    try {
      console.log("Inside TakController Class getTaskById method");
      const task = await taskModel.findById(req.params.id);
      if (!task) throw new customError("No Task is present by the id", 404);
      res.status(200).json({
        status: true,
        message: "data Retrived Successfully",
        data: task,
      });
    } catch (error) {
      console.log(
        "Error Inside taskController class getTaskById method " + error
      );
      if (error instanceof customError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
  async getTasks(req, res) {
    try {
      console.log("Inside taskController getTasks method");
      const tasks = await taskModel.find();
      if (!tasks) throw new customError("Error While Retriving the tasks", 404);
      res.status(200).json({
        status: true,
        message: "Data Retrived Successfully",
        data: tasks,
      });
    } catch (error) {
      console.log("Error Inside taskController class getTasks method " + error);
      if (error instanceof customError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
  async addMultipleTasks(req, res) {
    try {
      console.log("Inside the task controller class addMultiple tasks method");
      console.log(typeof req.body);
      if (req.body === undefined || req.body.length === 0)
        return res
          .status(400)
          .json({ status: false, message: "Send Proper Data" });
      const taskarr = await taskModel.insertMany(req.body);
      if (!taskarr) throw new customError("Error While Insertin the tasks");
      res.status(200).json({ status: true, message: "Data Inserted" });
    } catch (error) {
      console.log(
        "Error Inside the task controller class addMultiple tasks method" +
          error
      );
      if (error instanceof customError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
  async getPendingTasks(req, res) {
    try {
      console.log("Inside task Controller class getPendingTask method");
      const query = {
        $and: [
          { status: { $in: ["Pending", "In Progress", "Overdue"] } },
          { dueDate: { $lt: Date.now() } },
        ],
      };
      const data = await taskModel.find(query);
      if (!data) throw new customError("Error While retriving tasks", 500);
      if (data.length === 0)
        res.status(200).json({ status: true, message: "No pending tasks" });
      res
        .status(200)
        .json({
          status: true,
          message: "Pending tasks retrieved",
          count: data.length,
          data: data,
        });
    } catch (error) {
      console.log(
        "Error Inside task Controller class getPendingTask method" + error
      );
      if (error instanceof customError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
  async getSummary(req, res) {
    try {
      console.log("Inside the Task Controller Class : getSummary Method");
      const query = [
        {
          $facet: {
            statusFieldCount: [
              {
                $group: {
                  _id: "$status",
                  count: { $count: {} },
                },
              },
            ],
            priorityFieldCount: [
              {
                $group: {
                  _id: "$priority",
                  count: { $count: {} },
                },
              },
            ],
          },
        },
      ];
      const data = await taskModel.aggregate(query);
      const map = new Map();

      data[0]["statusFieldCount"].map((val) => {
        map.set(val._id, val.count);
      });
      data[0]["priorityFieldCount"].map((val) => {
        map.set(val._id, val.count);
      });
      const response = Object.fromEntries(map);
      res.status(200).json({
        status : true,
        message : "Summary Data Retrived",
        data : response
      });
    } catch (error) {
      console.log(
        "Error Inside the Task Controller Class : getSummary Method" + error
      );
      if (error instanceof customError)
        return res
          .status(error.code)
          .json({ status: false, message: error.message });
      res.status(500).json({ status: false, message: error.message });
    }
  }
}
module.exports = new taskController();
