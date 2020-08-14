const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const cookieParser = require("cookie-parser")

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate, getToken } = require("../middleware/jwtauth")

var db // store db object in this object
database.connectDB(() => (db = database.getDb("users"))) // get a user collection

//this path is not needed, delete it before deployment
router.get("/login", (req, res) => {
	res.redirect(redirectURL)
})

router.get("/github", githubAuth, async (req, res) => {
	//we will get user data in req.user.data
	//check if user exists
	try {
		let userId = await db.findOne(
			{ email: req.user.data.email },
			{ projection: { _id: 1 } }
		)
		//if user does not exist, create a new user
		if (!userId) {
			user = {
				name: req.user.data.name,
				username: req.user.data.login,
				email: req.user.data.email,
				githubProfile: req.user.data.html_url,
				avatar: req.user.data.avatar_url,
			}
			user = await db.insertOne(user)
			userId = user.insertedId
		}
		const token = getToken(userId)
		console.log("=======UserID====: ", userId)
		res.cookie("jwt", token, { path: "/", httpOnly: true, sameSite: true })
		res.redirect("http://localhost:9000/dashboard")
	} catch (error) {
		res.status(500).send("Github authentication Failed, Try again!")
		console.log(error)
	}
})

module.exports = router
