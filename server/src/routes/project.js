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

// get project details
router.get("/:projectId", async (req, res) => {
	// no authentication required in this route
	const projectId = req.params.projectId
	if (!projectId) return res.status(400).send("No Id Found")

	try {
		const project = await projectDb.findOne({ _id: projectId })
		res.send(project)
	} catch (err) {
		console.log(err)
		res.status(404).send("No Project found with this id")
	}
})

router.get("/get-projects/:username", authenticate, async (req, res) => {
	const username = req.params.username
	if (username) {
		const userDb = getDb("user")
		const userId = userDb.findOne(
			{ username: username },
			{ projectction: { _id: 1 } }
		)
	} else userId = req.userId
	try {
		const devDb = getDb("project")
		const projects = await devDb
			.findMany({ "developer.userId": userId })
			.toArray()
		res.send(projects)
	} catch (err) {
		console.log(err)
		res.send(500).send("Try again!")
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

router.post("/search", async (req, res) => {
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

// dev name and github url

module.exports = router

//titile, desc, github, tags, skills, status, postdate
