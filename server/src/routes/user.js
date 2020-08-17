const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const User = require("../models/user")

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate, getToken } = require("../middleware/jwtauth")

var userDb // store db object in this object
database.connectDB(() => (userDb = database.getDb("user")))

//this path is not needed, delete it before deployment
router.get("/login", (req, res) => {
	res.redirect(redirectURL)
})

router.get("/github", githubAuth, async (req, res) => {
	//we will get user data in req.user.data
	//check if user exists
	try {
		let userId = await userDb.findOne(
			{ username: req.user.data.login },
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
			user = await userDb.insertOne(user)
			userId = user.insertedId
		}
		const token = getToken(userId)
		res.cookie("jwt", token, {
			path: "/",
			httpOnly: true,
			SameSite: true,
		})
		res.redirect("/dashboard")
	} catch (error) {
		res.status(500).send("Github authentication Failed, Try again!") //-------- redirect user
		console.log(error)
	}
})

router.get("/logout", (req, res) => {
	res.clearCookie("jwt")
	res.send("You are logged out perfectly") // ------- redirect user here
})

// to get user details
router.get("/profile", authenticate, async (req, res) => {
	try {
		const user = await userDb.findOne(
			{ _id: req.userId },
			{ projection: { _id: 0 } }
		)
		res.send(user)
	} catch (error) {
		res.status(400).status("User Not Found")
		console.log(error)
	}
})

//to update user details
router.put("/profile", authenticate, async (req, res) => {
	const user = req.body
	User.validate(user)
	if (User.validate.errors) return res.status(400).send("Invalid Data")

	try {
		await userDb.updateOne({ _id: req.userId }, { $set: user })
		return res.status(200).send(true)
	} catch (error) {
		console.log(error)
		res.status(400).send("Try Again!")
	}
})

module.exports = router
