const Ajv = require("ajv")
const database = require("../database/db")

var db // store db object in this object
database.connectDB(() => (db = database.getDb("users"))) // get a user collection

const ajv = new Ajv({
	allErrors: true,
})

// user model
const userModel = {
	type: "object",
	required: ["name", "username", "email", "githubProfile", "avatar"],
	additionalProperties: false,

	properties: {
		name: { title: "Full Name ", type: "string", maxLength: 40 },
		username: { title: "Username", type: "string", maxLength: 40 },
		email: { title: "Email", type: "string", format: "email" },
		githubProfile: {
			title: "Github Profile",
			type: "string",
			format: "url",
		},
		linkedInProfile: {
			title: "LinkedIn Profile",
			type: "string",
			format: "url",
		},
		avatar: { title: "Avatar", type: "string", format: "url" },
		skills: {
			title: "Skills",
			type: "array",
			items: { type: "string", maxLength: 40 },
		},
		bookmarks: {
			title: "Bookmarks",
			type: "array",
			items: { type: "string", maxLength: 40 },
		},
	},
}

//user validation model
const validate = ajv.compile(userModel)

const getUser = async (userId) => {
	return await db.findOne({ _id: userId })
}

const getUserProjects = async (userId) => {
	const devDb = getDb("developers")
	return await devDb.findMany({ _id: userId })
}

module.exports = { validate }
