const mongoose = require('mongoose')
const friendsDetailsModel = new mongoose.Schema({
    userId:{type:String},
    friends:[

    ]
})

const friendsDetails = mongoose.model('FriendsList',friendsDetailsModel)
module.exports = friendsDetails