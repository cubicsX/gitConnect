const jwt = require("jsonwebtoken")
const ObjectId = require("mongo").ObjectId

const getToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: 60 * 60 * 24 * 1,
	})
}

const authenticate = async (req, res, next) => {
	try {

		const token = req.cookies["jwt"]
		console.log(token)
		const idObject = jwt.verify(token, process.env.JWT_SECRET)
		req.userId = idObject.id
		next()
	} catch (error) {
		return res.status(404).send("Please Login") // here, redirect to the login page.
	}
}

module.exports = {
	getToken,
	authenticate,
}
