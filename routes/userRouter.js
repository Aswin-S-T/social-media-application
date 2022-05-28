const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const data = require("../data");
const User = require("../models/userModel");
const { generateToken, verifyToken } = require("../utils/utils");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const Post=require("../models/postModel");

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
    // console.log("USER==============", user);
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
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post('/add-post',async(req,res)=>{
  console.log('called_________-')
    const userData = req.user
    let postData = req.body
    await Post.create(postData)
    res.send('post called')
})

userRouter.get('/get-my-post/:userId',async(req,res)=>{
  let post = await Post.find({userId:req.params.userId})
  res.send(post)
})

userRouter.delete('/delete-my-post/:postId',async(req,res)=>{
  let postId = req.params.postId
  await Post.deleteOne({_id :postId}).then((response)=>{
    if(response.acknowledged == true){
      res.send('Successfully deleted')
    }
  })
})

module.exports = userRouter;
