const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const data = require("../data");
const User = require("../models/userModel");
const { generateToken, verifyToken } = require("../utils/utils");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const Post=require("../models/postModel");
var mongoose = require('mongoose');
var myId = mongoose.Types.ObjectId();
const FriendRequest = require('../models/friendsModel')
var ObjectId = require('mongoose').Types.ObjectId; 

userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser),
    });
  })
);

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log("USER==============", user);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          username: user.username,
          email: user.email,
          isBlocked: user.isBlocked,
          token: generateToken(user),
        });
        return;
      }
    }else{
      res.send({message:'User Not Found!'})
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post('/add-post',async(req,res)=>{
  console.log('called_________-')
    const userData = req.user
    let postData = req.body
    console.log('POST DATA_________-',postData)
    let post = await Post.create(postData)
    console.log('post db=============',post)
    res.send(post)
})

// userRouter.get('/get-my-post/:userId',async(req,res)=>{
//   console.log('ID===========',req.params.userId)
//   console.log('POST CALLED')
//   let userData = await User.find({_id:req.params.userId})
//   console.log('USER DATA=========>',userData)
//   let postData = {}
//   let post = await Post.find({userId:req.params.userId})
//   postData.userId = userData[0]._id;
//   postData.username = userData[0].username;
//   postData.postDetails = post
//   // post.user = userData[0]
//   res.send(postData)
// })

userRouter.get('/get-my-post/:userId',async(req,res)=>{
  console.log('ID=============>',req.params.userId)
    let userData = await User.find({_id:req.params.userId})
  console.log('USER DATA=========>',userData)
  let postData = {}
  let post = await Post.find({userId:req.params.userId})
  postData.userId = userData[0]._id;
  postData.username = userData[0].username;
  postData.postDetails = post
  post.user = userData[0]
  res.send(postData)
})

userRouter.delete('/delete-my-post/:postId',async(req,res)=>{
  let postId = req.params.postId
  await Post.deleteOne({_id :postId}).then((response)=>{
    if(response.acknowledged == true){
      res.send('Successfully deleted')
    }
  })
})

// userRouter.get('/all-post',async(req,res)=>{
//   let post = await Post.find({})
//   let postData = post.find((x)=>x.userId == '628dad561f7d2ac39f3c28cf')
//   res.send(post)
// })

userRouter.get('/all-post',async(req,res)=>{
  // let post = await Post.aggregate([
  //   { $lookup:
  //       {
  //          from: "users",
  //          localField: "userId",
  //          foreignField: "ObjectId(_id)",
  //          as: "postData"
  //       }
  //   }])
  let post = await Post.find({})
  // console.log('POST ID : ',post[0].userId)
  let userId = post[0].userId
  let username = await User.findOne({_id : userId})
  // console.log('USER + ',username.username)
  // let postData = post.find((x)=>x.userId == '628dad561f7d2ac39f3c28cf')
  post[username] = username.username
  res.send(post)
})



userRouter.post('/like/:postId',async(req,res)=>{
  let postId = req.params.postId
  await Post.findOne({})
})

userRouter.get('/users',async(req,res)=>{
  const query = req.query
  console.log('QUERY==========',query)
  let users = await User.find({})
  users = await User.find({$nor:[{'_id':query.username}]});
  // users = users.find((x)=>{console.log(x)})
  res.send(users)
})

userRouter.get('/users/:id',async(req,res)=>{
  const userId = req.params.id
  const userData = await User.find({_id:userId})
  if(userData){
    res.send(userData)
  }else{
    res.send({message:'User Not Found'})
  }
})

userRouter.post('/like',async(req,res)=>{
  let postId = req.body.postId;
  let userId = req.body.userId

})

userRouter.post('/add-friend',async(req,res)=>{
  let from = req.body.fromId
  let user = await User.findOne({_id:from})
  console.log('AASER=========',user)
  let requestData = {
    fromId:req.body.fromId,
    toId:req.body.toId,
    username:user.username
  }
  await FriendRequest.create(requestData).then((response)=>{
    res.send(response)
  })
})

userRouter.get('/get-friend-request/:userId',async(req,res)=>{
  let userId = req.params.userId;
  let request = await FriendRequest.find({toId:userId})
  let users = await User.find({_id:userId})
  // console.log('USERS============',request)
  console.log('user*********',request)
  let aswins = request.find((x)=>{console.log(x)})
 console.log('ASWINS=============',aswins)
  let requestData = {}
  requestData.count = request.length
  requestData.request = request

  

  res.send(requestData)
})

module.exports = userRouter;
