const axios = require("axios")

const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`

const githubAuth = async (req, res, next) => {
	// url to get a user data, we get a code from /login url, which we will send in this url to github api with our github credentials
	try {
		const resGithub = await axios.post(
			`https://github.com/login/oauth/access_token`,
			{
				// apis and user token passsed to request
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code: req.query.code,
			},
			{
				//options object to pass addtional requirements, here, we accept json
				headers: { accept: "application/json" },
			}
		) // post req ends here
		const accessToken = resGithub.data.access_token //Bearer access token,

		const userGithub = await axios.get("https://api.github.com/user", {
			headers: {
				Authorization: "token " + accessToken,
				accept: "application/json",
			},
		})
		req.user = userGithub
	} catch (error) {
		throw error
	}
	next() // call the route
}

module.exports = {
	redirectURL,
	githubAuth,
}
