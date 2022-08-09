const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const data = require("../data");
const User = require("../models/userModel");
const { generateToken, verifyToken } = require("../utils/utils");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const Post = require("../models/postModel");
var mongoose = require("mongoose");
var myId = mongoose.Types.ObjectId();
const FriendRequest = require("../models/friendsModel");
const friendsDetailsModel = require("../models/friendsModel");
var ObjectId = require("mongoose").Types.ObjectId;
const { cloudinary } = require("../utils/helpers");
const FriendsList = require("../models/friendsListModel");

userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  "/register",
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
    } else {
      res.send({ message: "User Not Found!" });
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post("/add-post", async (req, res) => {
  const userData = req.user;
  let postData = req.body;
  let post = await Post.create(postData);
  res.send(post);
});

userRouter.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "cloudinary_react",
    });
    let post = await Post.create(req.body);
    res.send(post);
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

userRouter.get("/get-my-post/:userId", async (req, res) => {
  let userData = await User.find({ _id: req.params.userId });
  let postData = {};
  let post = await Post.find({ userId: req.params.userId });
  res.send(post);
});

userRouter.delete("/delete-my-post/:postId", async (req, res) => {
  let postId = req.params.postId;
  await Post.deleteOne({ _id: postId }).then((response) => {
    if (response.acknowledged == true) {
      res.send("Successfully deleted");
    }
  });
});

userRouter.get("/all-post", async (req, res) => {
  let post = await Post.find({});
  let userId = post[0].userId;
  let username = await User.findOne({ _id: userId });
  post[username] = username.username;
  res.send(post);
});

userRouter.post("/like/:postId", async (req, res) => {
  let postId = req.params.postId;
  await Post.findOne({});
});

userRouter.get("/users", async (req, res) => {
  const query = req.query;
  let users = await User.find({});
  users = await User.find({ $nor: [{ _id: query.username }] });
  res.send(users);
});

userRouter.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = await User.find({ _id: userId });
  if (userData) {
    res.send(userData);
  } else {
    res.send({ message: "User Not Found" });
  }
});

userRouter.post("/like", async (req, res) => {
  let postId = req.body.postId;
  let userId = req.body.userId;
});

userRouter.post("/add-friend", async (req, res) => {
  let from = req.body.fromId;
  let user = await User.findOne({ _id: from });
  let requestData = {
    fromId: req.body.fromId,
    toId: req.body.toId,
    username: user.username,
  };
  await FriendRequest.create(requestData).then((response) => {
    res.send(response);
  });
});

userRouter.get("/get-friend-request/:userId", async (req, res) => {
  let userId = req.params.userId;
  let request = await FriendRequest.find({ toId: userId });
  let users = await User.find({ _id: userId });
  let aswins = request.find((x) => {
    console.log(x);
  });
  let requestData = {};
  requestData.count = request.length;
  requestData.request = request;

  res.send(requestData);
});

userRouter.post("/acceptAsFriend/:friendId", async (req, res) => {
  const friendId = req.params.friendId;
  const userId = req.body.userId;
  let friend = await FriendsList.findOne({ userId: userId });
  if (friend) {
    await FriendsList.updateOne(
      {
        userId: ObjectId(userId),
      },
      {
        $push: {
          friends: {
            friendId: friendId,
            isBlocked: false,
          },
        },
      }
    ).then(async (res) => {
      if (res) {
        console.log("FRID : ", friendId);
        let user = await FriendRequest.findOne({ _id: friendId });
        await FriendRequest.deleteOne({ _id: friendId });
      } else {
        console.log("failed");
      }
    });
  } else {
    await FriendsList.create(
      {
        userId: userId,
      },
      {
        $push: {
          friends: {
            friendId: friendId,
            isBlocked: false,
          },
        },
      }
    );
  }
  res.send("Success");
});

userRouter.get('/get-my-friends/:userId',async(req,res)=>{
  const userId = req.params.userId;
  let friends = await FriendsList.find({userId:userId})
  
  res.send(friends[0].friends)
})

module.exports = userRouter;
