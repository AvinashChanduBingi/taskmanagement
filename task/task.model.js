const mongoose  = require("mongoose");
const joi = require('joi');

const schema = new mongoose.Schema({
    title : {
        type : String,
        required : true 
    },
    description : {
        type : String,
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    },
    updatedAt : {
        type : Date,
    },
    createdBy : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'users',
        required : true
    },
    assignedTo : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'users',
        required : true
    },
    status : {
        type : String,
        enum : ['Pending','In Progress','Completed','Overdue'],
        default : 'Pending'
    },
    priority : {
        type : String,
        enum : ['Low','High','Medium','Critical'],
        default : 'Low'
    },
    dueDate : {
        type : Date,
        required : true 
    },
    tags : [String],
    comments : [{
        text : String,
        userId : {type : mongoose.SchemaTypes.ObjectId,ref : 'users'},
        timeStamp : Date 
    }],
    isDeleted : Boolean
});

const taskModel = mongoose.model('tasks',schema);

const taskValidation = joi.object({
    title : joi.string().required(),
    description : joi.string().required(),
    createdAt : joi.date().required(),
    updatedAt : joi.date(),
    assignedTo : joi.string().trim().regex(/^[0-9A-Fa-f]{24}$/),
    createdBy : joi.string().trim().regex(/^[0-9A-Fa-f]{24}$/),
    status : joi.string(),
    priority : joi.string(),
    dueDate : joi.date(),
    tags : joi.array().items(joi.string()),
    comments : joi.array().items(joi.object({
        text : joi.string(),
        userId : joi.string().trim().regex(/^[0-9A-Fa-f]{24}$/),
        timeStamp : joi.date()
    })),
    isDeleted : joi.boolean()
});

module.exports = { taskModel , taskValidation};