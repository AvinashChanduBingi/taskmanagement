const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./routes/routes");
const { taskModel } = require("./task/task.model");
//api middle ware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api",router);

//Mongoose connection
mongoose.connect(process.env.MONGOPORT).then(console.log("connected to Mongodb")).catch(err=>console.log("Error in Mogodb"+err));

app.listen(process.env.SEVRERPORT,function(err,res){
    console.log("Live on Server Port : "+process.env.SEVRERPORT)
});



