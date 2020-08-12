const express = require("express")
const app = express()
const userRouter = require("./routes/user")
const config = require("../config")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRouter)

// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE

app.listen(config.port, () => console.log("Server Started on :", config.port))
