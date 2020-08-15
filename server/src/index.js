const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const auth = require("./middleware/jwtauth")
const userRouter = require("./routes/user")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use(express.static(path.join(__dirname, "build")))
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.get("/dashboard", auth.authenticate, function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.get("/test", (req, res) => {
	console.log(req.cookies)
	res.send("Done")
})

// MANAGE ALL INVALID ROUTER IN invalid.js ROUTES FILE
app.listen(process.env.PORT, () =>
	console.log("Server Started on :", process.env.PORT)
)
