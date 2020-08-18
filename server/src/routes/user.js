const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const User = require("../models/user")

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate, getToken } = require("../middleware/jwtauth")
const user = require("../models/user")

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
			let user = {
				name: req.user.data.name,
				username: req.user.data.login,
				email: req.user.data.email,
				githubProfile: req.user.data.html_url,
				avatar: req.user.data.avatar_url,
				githubProjects: req.user.data.public_repos,
				linkedInProfile: null,
				skills: [],
				bookmarks: [],
				githubToken: req.user.githubToken,
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


//to update user details
router.get("/profile", authenticate, async (req, res) => {
	try {
		const user = await userDb.findOne(
			{ _id: req.userId },
			{ projection: { _id: 0, githubToken: 0 } }
		)
		res.send(user)
	} catch (error) {
		res.status(400).status("User Not Found")
		console.log(error)
	}
})

//to update user details
router.put("/profile", authenticate, async (req, res) => {
	const linkedInProfile = req.body.linkedInProfile
	const skills = req.body.skills
	console.log(req.body)

	try {
		await userDb.updateOne(
			{ _id: req.userId },
			{ $set: { linkedInProfile, skills } }
		)
		return res.status(200).send(true)
	} catch (error) {
		res.status(400).status("User Not Found")
		console.log(error)
	}
})

router.post("/addbookmark", authenticate, async (req, res) => {
	console.log(req)
	const projectId = req.body.projectId
	const projectTitle = req.body.projectTitle
	try {
		const result = await userDb.updateOne(
			{ _id: req.userId },
			{
				$push: {
					bookmarks: {
						projectId: projectId,
						projectTitle: projectTitle,
					},
				},
			}
		)
		res.send("Added Bookmark")
	} catch (err) {
		console.log(err)
		res.status(400).send("Try again")
	}
})

router.get("/update-github", authenticate, async (req, res) => {
	try {
		const { githubToken } = await userDb.findOne(
			{ _id: req.userId },
			{ projection: { githubToken: 1, _id: 0 } }
		)
		console.log(githubToken, " github token")
		if (githubToken) {
			let userGithub = await axios.get("https://api.github.com/user", {
				headers: {
					Authorization: "Bearer " + githubToken,
					accept: "application/json",
				},
			})
			userGithub = userGithub.data
			let user = {
				name: userGithub.name,
				username: userGithub.login,
				email: userGithub.email,
				githubProfile: userGithub.html_url,
				avatar: userGithub.avatar_url,
				githubProjects: userGithub.public_repos,
			}
			await userDb.updateOne({ _id: req.userId }, { $set: user })
			res.send(user)
		}
	} catch (err) {
		console.log(err)
		res.status(500).send("Can not update user profile")
	}
})

module.exports = router
