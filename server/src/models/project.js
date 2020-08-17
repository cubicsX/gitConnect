const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

//project model
const projectModel = {
	type: "object",
	required: [
		"projectTitle",
		"shortDesc",
		"githubRepo",
		"postDate",
		"status",
		"tags",
		"skillsRequired",
	],
	additionalProperties: false,

	properties: {
		projectTitle: { type: "string", maxLength: 60 },
		shortDesc: { type: "string", maxLength: 200 },
		githubRepo: { type: "string", format: "url" },
		postDate: { type: "object" },

		status: { type: "string", enum: ["active", "ongoing", "hide"] },
		tags: { type: "array", items: { type: "object"} },
		skillsRequired: {
			type: "array",
			items: { type: "object"},
		},

		// developer model
		developer: {
			type: "object",
			required: ["userId", "authority", "role", "status"],
			additionalProperties: false,

			properties: {
				userId: { type: "object" },
				authority: {
					type: "string",
					enum: ["owner", "collaborator", "developer"],
				},
				role: {
					type: "string",
					maxLength: 40,
				},
				status: {
					type: "string",
					enum: ["accepted", "pending", "rejected"],
				},
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
		},
	},
}

const validate = ajv.compile(projectModel)

module.exports = {
	validate,
}
