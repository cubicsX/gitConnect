const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

const developerModel = {
	type: "object",
	required: ["projectId", "username", "authority", "role", "status"],
	additionalProperties: false,

	properties: {
		projectId: { type: "string" },
		username: { type: "string" },
		authority: {
			type: "string",
			enum: ["owner", "collaborator", "developer"],
		},
		role: { type: "array", items: { type: "string", maxLength: 40 } },
		status: { type: "string", enum: ["accepted", "pending", "rejected"] },
		comments: {
			type: "array",
			itemes: {
				type: "object",
				properties: {
					username: { type: "string" },
					comment: { type: "string" },
				},
			},
		},
	},
}

const validateDeveloper = ajv.compile(developerModel)

module.exports = {
	validateDeveloper,
}
