const express = require("express")
const app = express()
<<<<<<< HEAD
const path = require('path')
//const userRouter = require("./routes/user")
//const config = require("../config")
/*
=======
const cookieParser = require("cookie-parser")

const userRouter = require("./routes/user")

>>>>>>> 69ae0d5f934b3350437853685140a2ad41b995b5
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/user", userRouter)

// so server response won't send the type of backend( express )
// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE
<<<<<<< HEAD
*/
app.use(express.static(path.join(__dirname,'build')));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'build','index.html'));
})
app.listen('3000', () => console.log("Server Started on :3000"));
=======

app.listen(process.env.PORT, () =>
	console.log("Server Started on :", process.env.PORT)
)
>>>>>>> 69ae0d5f934b3350437853685140a2ad41b995b5
