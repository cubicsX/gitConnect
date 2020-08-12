const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

// user model
const userModel = {
	type: "object",
	required: ["name", "username", "email", "githubProfile", "avatar"],
	additionalProperties: false,

	properties: {
		name: { type: "string", maxLength: 40 },
		username: { type: "string", maxLength: 40 },
		email: { type: "string", format: "email" },
		githubProfile: { type: "string", format: "url" },
		avatar: { type: "string", format: "url" },
		skills: { type: "array", items: { type: "string", maxLength: 40 } },
	},
}

const validateUser = ajv.compile(userModel)
console.log(validateUser({}), validateUser.errors)

module.exports = {
	validateUser,
}
