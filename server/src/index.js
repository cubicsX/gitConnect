const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

const userRouter = require("./routes/user")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/user", userRouter)

// so server response won't send the type of backend( express )
// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE

app.listen(process.env.PORT, () =>
	console.log("Server Started on :", process.env.PORT)
)
