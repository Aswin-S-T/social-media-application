const express = require('express')
const userRouter=require('./routes/userRouter')
const app = express()
const port = process.env.PORT || 8000
const db = require('./config/db')
const path = require('path')
const cors = require('cors')
const uploadRouter=require('./routes/uploadRouter')
require('dotenv').config()

// Database connection
db.connect()

// Middlwares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// console.log('PATH=========>',path.join(__dirname,'../frontend/uploads')) // path.join(__dirname+'../test/karma.conf.js')

app.get('/',(req,res)=>{
    res.send('nodejs is working')
})

// Route settings
app.use('/api/v1/user',userRouter)
app.use('/api/v1/uploads',uploadRouter)

app.listen(port,()=>{
    console.log(`Server is running at the port ${port}`)
})