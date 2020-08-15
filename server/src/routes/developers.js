const router = require("express").Router()
const axios = require("axios")
const { redirectURL, githubAuth } = require("../middleware/githubAuth")
const database = require("../database/db")
const User = require("../models/user")

// require jwtAuth function, getTOken is to get new tokens, authenticate will very the tokens
const { authenticate, getToken } = require("../middleware/jwtauth")

var db // store db object in this object
database.connectDB(() => (db = database.getDb("users"))) // get a user collection

module.exports = router
