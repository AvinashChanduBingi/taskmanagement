const joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['Active','Inactive','Suspended'],
        default : 'Inactive'
    },
    role : {
        type : String,
        enum : ['Admin','User','Manager'],
        default : 'User'
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    lastLoginAt : {
        type : Date,
        default : Date.now()
    },
    isDeleted : {
        type : Boolean
    }
},{timestamps : true});

const userModel = mongoose.model('users',schema);



const userValidation = joi.object({
    name : joi.string().required(),
    email : joi.string().required(),
    password : joi.string().required(),
    status : joi.string().default('Inactive'),
    role : joi.string().default('User'),
    createdAt : joi.date(),
    updatedAt : joi.date(),
    lastLoginAt : joi.date(),
    isDeleted : joi.boolean()

})

module.exports = {userModel,userValidation};
