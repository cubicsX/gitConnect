const MongoClient = require("mongodb").MongoClient

//to access the db object in other functions and files.

//wrapped .connet method in connectDb, and passed callback.
//because .connect is callback based method. it will only return db in callback, so to use db in other methods/files,
// we need to provide synchonized access to db object. Other files will call connectDb, in that method, they will call
//getDb to get the Db object.
var db

const connectDB = (callback) => {
	if (db) return callback()
	MongoClient.connect(
		process.env.MONGODB,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(err, dbase) => {
			if (err) return console.log(err)
			db = dbase.db("gitconnect") // store it in db, so we can access it elsewhere
			console.log("Database Connected")
			callback()
		}
	)
}
// pass the collection you want in db
const getDb = (coll) => {
	if (coll) return db.collection(coll)
	else return db
}
module.exports = {
	connectDB,
	getDb,
}
