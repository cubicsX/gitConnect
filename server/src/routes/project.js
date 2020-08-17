const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const Project = require("../models/project")

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate} = require("../middleware/jwtauth")

var projectDb // store db object in this object
database.connectDB(() => (projectDb = database.getDb("project")))
// database.connectDB(() => (projectDb = database.getDb("project"))) // get a user collection

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
router.post("/addproject", authenticate, async (req, res) => {
	console.log(req.body)
	const projectData = req.body.projectData
	projectData.postDate = new Date()

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

router.get("/get-projects/:userId", authenticate, async (req, res) => {
	const userId = req.params.userId
	if (!userId) userId = req.userId
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
	const projectData = req.body.projectData
	projectData.postDate = new Date()

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

module.exports = router
