const mongoose = require('mongoose')
const dbUrl = 'mongodb+srv://aswins:7VtfydtNGvOiO6o7@cluster0.ptzkj.mongodb.net/?retryWrites=true&w=majority'
console.log('DB ___________',dbUrl)
module.exports.connect = function(done){
    mongoose.connect(dbUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },(err)=>{
        if(err){
            console.log('Err : ',err)
        }else{
            console.log('Mongodb connected successfully....')
        }
    })
}