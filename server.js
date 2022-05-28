const express = require('express')
const userRouter=require('./routes/userRouter')
const app = express()
const port = process.env.PORT || 5000
const db = require('./config/db')
const cors = require('cors')
require('dotenv').config()

// Database connection
db.connect()

// Middlwares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get('/',(req,res)=>{
    res.send('nodejs is working')
})

// Route settings
app.use('/api/v1/user',userRouter)

app.listen(port,()=>{
    console.log(`Server is running at the port ${port}`)
})