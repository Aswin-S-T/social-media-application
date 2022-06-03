const mongoose = require('mongoose')
const friendsSchema = new mongoose.Schema({
    fromId:{type:String,required:true},
    toId:{type:String,required:true},
    username:{type:String},
    isFriend:{type:Boolean,default:false}
},{
    timestamps:true
})

const FriendRequest = mongoose.model('FriendRequest',friendsSchema)
module.exports = FriendRequest