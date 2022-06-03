const express = require("express");
const uploadRouter = express.Router();
const multer = require("multer");
var path = require('path');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "../frontend/public/uploads/"); // express.static(path.join(__dirname, '../frontend/src/uploads'))
  },
  filename(req, file, cb) {
    
    console.log("BODY*********", req.body.userId);
    let id = req.body.userId + "_" + Date.now();
    cb(null, `${id}.jpg`);
  },
});

const upload = multer({ storage });




uploadRouter.post("/", upload.single("image"), (req, res) => {
    console.log('BODY____________',req.body)
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
