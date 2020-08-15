const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const Project = require("../models/project")

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate, getToken } = require("../middleware/jwtauth")

var projectDb // store db object in this object
database.connectDB(() => (projectDb = database.getDb("project"))) // get a user collection

// get project details
router.get("/:projectId", async (req, res) => {
	// no authentication required in this route
	const projectId = req.params.projectId
	if (!projectId) return res.status(400).send("No Id Found")

	try {
		const project = await projectDb.findOne({ _id: projectId }, { projections:})
	} catch (err) {
		console.log(err)
		res.status(404).send("No Project found with this id")
	}
})


module.exports = router
