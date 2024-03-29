const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const Project = require("../models/project")
const ObjectID = require("mongodb").ObjectID

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate } = require("../middleware/jwtauth")

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
	try {
		let projects = await projectDb
			.find({ "developer.userId": userId })
			.toArray()

		let userIds = []
		for (let i = 0; i < projects.length; i++)
			for (let j = 0; j < projects[i].developer.length; j++)
				userIds.push(projects[i].developer[j].userId)

		const userDb = database.getDb("user")
		const usernames = await userDb
			.find({ _id: { $in: userIds } }, { projection: { username: 1 } })
			.toArray()
		console.log(usernames)

		let ownerProject = [],
			collaboratorProject = []
		for (let i = 0; i < projects.length; i++) {
			let devs = projects[i].developer
			for (let j = 0; j < devs.length; j++) {
				for (let user = 0; user < usernames.length; user++) {
					if (
						devs[j].userId.toString() ===
						usernames[user]._id.toString()
					)
						devs[j].username = usernames[user].username
				}
				if (devs[j].userId.toString() === userId.toString()) {
					if (devs[j].authority == "owner")
						ownerProject.push(projects[i])
					else collaboratorProject.push(projects[i])
				}
			}
		}
		//owner , collaborator, accepted
		res.send([ownerProject, collaboratorProject])
	} catch (err) {
		console.log(err)
		res.status(500).send("Try again!")
	}
})

router.post("/addproject", authenticate, async (req, res) => {
	const projectData = req.body
	projectData.postDate = new Date()

	console.log(req.userId)
	projectData.developer = [
		{
			userId: req.userId,
			authority: "owner",
			role: "empty",
			status: "accepted",
		},
	]
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

router.post("/requests", authenticate, async (req, res) => {
	const projectId = ObjectID(req.body.projectId)
	const userId = ObjectID(req.body.userId)
	const status = req.body.status
	try {
		let result = await projectDb.findOne({
			_id: projectId,
			$and: [
				{ "developer.$.userId": req.userId },
				{ "developer.$.authority": "owner" },
			],
		})
		console.log(result)
		if (result) {
			result = await projectDb.updateOne(
				{
					_id: projectId,
					"developer.userId": userId,
				},
				{ $set: { "developer.$.status": status } }
			)
		}
		res.send("Contributor Added Successfully.")
	} catch (err) {
		console.log(err)
		res.status(400).send("Try again")
	}
})

router.post("/join-project", authenticate, async (req, res) => {
	const projectId = req.body.projectId
	let contributer = {
		userId: req.userId,
		authority: "contributer",
		role: "developer",
		status: "pending",
	}
	try {
		await projectDb.updateOne(
			{ _id: ObjectID(projectId) },
			{ $push: { developer: contributer } }
		)
		res.send("Request Sent")
	} catch (err) {
		console.log(err)
		res.status(400).send(err)
	}
})

module.exports = router

//titile, desc, github, tags, skills, status, postdate
