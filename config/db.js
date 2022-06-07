const mongoose = require('mongoose')
const dbUrl = 'mongodb+srv://aswins:7VtfydtNGvOiO6o7@cluster0.ptzkj.mongodb.net/?retryWrites=true&w=majority'
// const dbUrl = 'mongodb://localhost:27017/usersblog'
// console.log('DB URL===============',dbUrl)
module.exports.connect = function(done){
    mongoose.connect(dbUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },(err)=>{
        if(err){
            console.log('Err : ',err)
        }else{
            console.log('connected!!!!!')
            console.log('Mongodb connected successfully....')
        }
    })
}