const Ajv = require("ajv")

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
		description: { type: "string" },
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
			items: { type: "object" },
		},
		bookmarks: {
			title: "Bookmarks",
			type: "array",
			items: { type: "object" },
		},
	},
}

//user validation model
const validate = ajv.compile(userModel)

module.exports = { validate }
