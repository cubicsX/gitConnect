const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

//developer Model
const developerModel = {
	type: "object",
	required: ["projectId", "userId", "authority", "role", "status"],
	additionalProperties: false,

	properties: {
		userId: { type: "string" },
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

//project model
const projectModel = {
	type: "object",
	required: [
		"title",
		"shortDesc",
		"githubRepo",
		"postDate",
		"status",
		"tags",
		"skillsRequired",
	],
	additionalProperties: false,

	projectTitle: { type: "string", maxLength: 60 },
	shortDesc: { type: "string", maxLength: 200 },
	githubRepo: { type: "string", format: "url" },
	postDate: { type: "string", format: "date" },

	status: { type: "string", enum: ["active", "ongoing", "hide"] },
	tags: { type: "array", items: { type: "string", maxLength: 40 } },
	skillsRequired: { type: "array", items: { type: "string", maxLength: 40 } },
	developer: developerModel,
}

const validate = ajv.compile(projectModel)

module.exports = {
	validate,
}
