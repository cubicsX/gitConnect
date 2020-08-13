const express = require("express")
const app = express()
const path = require('path')
//const userRouter = require("./routes/user")
//const config = require("../config")
/*
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRouter)

// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE
*/
app.use(express.static(path.join(__dirname,'build')));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'build','index.html'));
})
app.listen('3000', () => console.log("Server Started on :3000"));
