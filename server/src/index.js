const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

const userRouter = require("./routes/user")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/user", userRouter)

app.get("/test", (req, res) => {
	console.log(req.cookies)
	res.send("---")
})

app.get("/remove", (req, res) => {
	console.log("Before: ", req.cookies)

	res.cookie("jwt", { expires: Date.now() - 1000 })
	console.log("After: ", req.cookies)

	res.send("---")
})

// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE

app.listen(process.env.PORT, () =>
	console.log("Server Started on :", process.env.PORT)
)
