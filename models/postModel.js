const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    postId:{type:String},
    userId: { type: String, required: true },
    title: { type: String },
    image:{type:String,required:true},
    description: { type: String },
    path:{type:String},
    like:{type:Number,default:0},
    comment:{type:Number,default:0},
    share:{type:Number,default:0},
    time:{type:String}
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
