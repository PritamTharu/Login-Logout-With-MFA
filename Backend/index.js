const express = require('express')
const app = express()
const cors = require('cors')
const Usersroute = require('./routes/userRoute')
const mfaRoute = require('./routes/mfaRoute')
const cookieParser = require('cookie-parser');
require('./dbconnection')
require('dotenv').config()
const PORT = process.env.PORT | 3000
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:4200',  
    methods: ['GET', 'POST', 'DELETE','PUT'],  
    allowedHeaders: ['Content-Type'],
    credentials: true
};
  
app.use(cors(corsOptions));

app.use('/api',Usersroute)
app.use('/api/mfa',mfaRoute)

app.listen(PORT,()=>{ console.log('Application listening on Port 3000') })