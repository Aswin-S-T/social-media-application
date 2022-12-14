const express = require("express");
const http = require("http");
// const { Server } = require("socket.io");
const userRouter = require("./routes/userRouter");
const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/db");
const path = require("path");
const cors = require("cors");
const uploadRouter = require("./routes/uploadRouter");
const { cloudinary } = require("./utils/helpers");
require("dotenv").config();

const server = http.createServer(app);

const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const NEW_CHAT_MESSAGE_EVENT = 'NEW_CHAT_MESSAGE_EVENT';
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });
  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId);
  });
});

// Database connection
db.connect();

// Middlwares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST"],
//   },
// });
var corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// console.log('PATH=========>',path.join(__dirname,'../frontend/uploads')) // path.join(__dirname+'../test/karma.conf.js')

app.get("/", (req, res) => {
  res.send("nodejs is working");
});

// Chat configuration
// io.on("connection", (socket) => {
//   console.log("USER CONNECTED : ", socket.id);
//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with id : ${socket.id} connected room ${data}`);
//   });
//   socket.on("send-message", (data) => {
//     console.log(data);
//     socket.to(data.room).emit("receive-message", data);
//   });
//   socket.on("disconnect", () => {
//     console.log("User disconnected!!!!");
//   });
// });
// End chat configuration

app.post("/api/upload", async (req, res) => {
  console.log("helllo");
  console.log("req body=========", req.body);
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "cloudinary_react",
      public_id: Date.now(),
    });
    let post = await Post.create(req.body);
    console.log("post db=============", post);
    res.send(post);
    res.json({ msg: "uploaded successfully" });
    // console.log(fileStr);
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/api/images", async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("folder:cloudinary_react")
    .sort_by("public_id", "desc")
    .max_results(30)
    .execute();
  const publicIds = resources.map((file) => file.public_id);
  res.send(publicIds);
});

// Route settings
app.use("/api/v1/user", userRouter);
app.use("/api/v1/uploads", uploadRouter);

server.listen(port, () => {
  console.log("DIR NMAE : ", __dirname);
  console.log(`Server is running at the port ${port}`);
});
