const express = require("express")
const app = express()
const userRouter = require("./routes/user")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRouter)

// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE

app.listen(process.env.PORT, () =>
	console.log("Server Started on :", process.env.PORT)
)
