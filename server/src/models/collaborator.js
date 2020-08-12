const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

const collaboratorModel = {
	type: "object",
	required: ["projectId", "username", "authority", "role", "status"],
	additionalProperties: false,

	properties: {
		projectId: { type: "string" },
		username: { type: "string" },
		authority: { type: "string", enum: ["owner", "collaborator"] },
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

const validateCollaborator = ajv.compile(collaboratorModel)

module.exports = {
	validateCollaborator,
}
