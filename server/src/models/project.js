const Ajv = require("ajv")
const ajv = new Ajv({ allErrors: true })

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

	title: { type: "string", maxLength: 60 },
	shortDesc: { type: "string", maxLength: 200 },
	githubRepo: { type: "string", format: "url" },
	postDate: { type: "string", format: "date" },

	status: { type: "string", enum: ["active", "ongoing", "hide"] },
	tags: { type: "array", items: { type: "string", maxLength: 40 } },
	skillsRequired: { type: "array", items: { type: "string", maxLength: 40 } },
}

const validate = ajv.compile(projectModel)

module.exports = {
	validate,
}
