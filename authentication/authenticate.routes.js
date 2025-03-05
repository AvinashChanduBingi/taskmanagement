const express = require("express");
const router = express.Router();
const auth = require("./authenticate");

router.post("/login",(req,res)=>auth.login(req,res));
router.post("/register",(req,res)=>auth.register(req,res));
router.post("/authenticate",(req,res)=>auth.authenticate(req,res));


module.exports = router;