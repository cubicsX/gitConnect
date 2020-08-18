const axios = require("axios")

const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`

const githubAuth = async (req, res, next) => {
	// url to get a user data, we get a code from /login url, which we will send in this url to github api with our github credentials
	const userCode = req.query.code
	if (!userCode) return res.status(404).send("Not Found")
	try {
		const resGithub = await axios.post(
			`https://github.com/login/oauth/access_token`,
			{
				// apis and user token passsed to request
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code: userCode,
			},
			{
				//options object to pass addtional requirements, here, we accept json
				headers: { accept: "application/json" },
			}
		) // post req ends here
		const accessToken = resGithub.data.access_token //Bearer access token,

		const userGithub = await axios.get("https://api.github.com/user", {
			headers: {
				Authorization: "Bearer " + accessToken,
				accept: "application/json",
			},
		})
		req.user = userGithub
		req.user.githubToken = accessToken
		next() // call the route
	} catch (error) {
		console.log(error)
		return res.send("Github Login failed, Try Again!")
	}
}

module.exports = {
	redirectURL,
	githubAuth,
}
