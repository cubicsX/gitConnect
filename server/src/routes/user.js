const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")

var db // store db object in this object
database.connectDB(() => (db = database.getDb("users")))

router.get("/login", (req, res) => {
	res.redirect(redirectURL)
})

router.get("/github", githubAuth, async (req, res) => {
	//we will get user data in req.user.data

	//check if user exists
	try {
		const isUser = await db.findOne({ email: req.user.data.email })
		if (isUser) {
			return res.send(isUser)
		}

		// create a new user
		const user = {
			name: req.user.data.name,
			username: req.user.data.login,
			email: req.user.data.email,
			githubProfile: req.user.data.html_url,
			avatar: req.user.data.avatar_url,
		}
		await db.insertOne(user)
		res.send(user)
	} catch (error) {
		res.status(500).send("Github authentication Failed, Try again!")
		console.log(error)
	}
})

module.exports = router
