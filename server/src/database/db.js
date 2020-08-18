const MongoClient = require("mongodb").MongoClient

//to access the db object in other functions and files.

//wrapped .connet method in connectDb, and passed callback.
//because .connect is callback based method. it will only return db in callback, so to use db in other methods/files,
// we need to provide synchonized access to db object. Other files will call connectDb, in that method, they will call
//getDb to get the Db object.
var database,
	isReq = false
count = 1

connectDB(() => console.log("Database Connected"))

async function connectDB(callback) {
	if (database) return callback()
	if (isReq) await sleep(3000).then(() => callback())
	isReq = true
	MongoClient.connect(
		process.env.MONGODB,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(err, dbase) => {
			if (err) return console.log(err)
			database = dbase.db("gitconnect") // store it in db, so we can access it elsewhere
			database.count = count++
			callback()
		}
	)
}
// pass the collection you want in db
const getDb = (coll) => {
	if (database) {
		if (coll) return database.collection(coll)
		else return database
	}
	sleep(1000).then(() => {
		return getDb(coll)
	})
}

function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms)
	})
}

module.exports = {
	connectDB,
	getDb,
}
