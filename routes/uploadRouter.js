const express = require("express");
const uploadRouter = express.Router();
const multer = require("multer");
var path = require('path');
const Post=require("../models/postModel");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "../frontend/public/uploads/"); // express.static(path.join(__dirname, '../frontend/src/uploads'))
  },
  filename(req, file, cb) {
    
    console.log("BODY*********", req.body.userId);
    let id = Date.now();
    cb(null, `${id}.jpg`);
  },
});

const upload = multer({ storage });




uploadRouter.post("/", upload.single("image"), async(req, res) => {
    console.log('BODY____________',req.body)
    // let postData = req.body
    // console.log('POST DATA_________-',postData)
    // let post = await Post.create(postData)
    res.send(`/${req.file.path}`);
});

uploadRouter.get('/all-images',(req,res)=>{
  let image = upload
  // let path = path.dirname
  console.log('PATH==========>',path.dirname((err,data)=>{
    if(err){
      console.log(err)
    }else{
      console.log('DATA=========>',data)
    }
  }))
})

// uploadRouter.get('/:imageId',async(req,res)=>{
//   let id = req.params.imageID
//  res.send(req.file + id)
// })

// uploadRouter.get('/',(req,res)=>{
//     res.send('upload router called')
// })

module.exports = uploadRouter;
