const mongoose = require("mongoose")

require('dotenv').config()
const URL = process.env.URL

mongoose.connect(URL)
mongoose.connection.on('connected',()=>{ console.log("Database is connected")})
mongoose.connection.on('error',()=>{ console.log("Error occured during connection")})