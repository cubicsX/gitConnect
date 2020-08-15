const jwt = require("jsonwebtoken")

const getToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: 60 * 60 * 24 * 1,
	})
}
const authenticate = async (req, res, next) => {
	try {
		const token = req.cookies["jwt"]
		if (!token)
			return res.status(404).send("Please Login, redirect to Login page")
		const idObject = jwt.verify(token, process.env.JWT_SECRET) // no need to verify object, becuase it will throw error if failed
		req.userId = idObject.id;
		next();
	} catch (error) {
		return res.status(404).send("Please Login, redirect to login page") // here, redirect to the login page.
	}
}
module.exports = {
	getToken,
	authenticate,
}
