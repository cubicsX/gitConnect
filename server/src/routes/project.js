const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const Project = require("../models/project")
const ObjectID = require("mongodb").ObjectID

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate, getToken } = require("../middleware/jwtauth")

var projectDb // store db object in this object
database.connectDB(() => (projectDb = database.getDb("project")))

router.post("/get-projects", authenticate, async (req, res) => {
	const username = req.body.username
	console.log(username)
	let userId
	if (username) {
		const userDb = database.getDb("user")
		userId = await userDb.findOne(
			{ username: username },
			{ projection: { _id: 1 } }
		)
		userId = userId._id
	} else userId = req.userId
	console.log(userId)
	try {
		const projects = await projectDb.find({}).toArray()
		console.log(projects)
		projects = projects.map((pro) => {
			pro.developer.userId = userId
		})
		res.send(projects)
	} catch (err) {
		console.log(err)
		res.status(500).send("Try again!")
	}
})

router.post("/addproject", authenticate, async (req, res) => {
	const projectData = req.body
	projectData.postDate = new Date()

	console.log(req.userId)
	projectData.developer = {
		userId: req.userId,
		authority: "owner",
		role: "empty",
		status: "accepted",
	}
	console.log(projectData)

	if (Project.validate(projectData)) {
		try {
			await projectDb.insertOne(projectData)
			return res.send("Project Added")
		} catch (err) {
			console.log(err)
			return res.status(500).send("Try Again!")
		}
	}
	console.log(Project.validate.errors)
	res.status(400).send("Invalid Data")
})

router.post("/search", authenticate, async (req, res) => {
	// add authenticate here
	console.log(req.body)
	let search = req.body.search
	search = search.split(" ")

	try {
		let project = await projectDb
			.find(
				{
					"skillsRequired.skill": { $in: search },
				},
				{
					projection: {
						developer: 0,
					},
				}
			)
			.toArray()

		res.send(project)
	} catch (err) {
		console.log(err)
		return res.status(400).send("Not Found")
	}
})

// get project details
router.post("/find", async (req, res) => {
	// no authentication required in this route
	const projectId = req.body.projectId
	if (!projectId) return res.status(400).send("No Id Found")

	try {
		const project = await projectDb.findOne({ _id: projectId })
		res.send(project)
	} catch (err) {
		console.log(err)
		res.status(404).send("No Project found with this id")
	}
})

module.exports = router

//titile, desc, github, tags, skills, status, postdate
