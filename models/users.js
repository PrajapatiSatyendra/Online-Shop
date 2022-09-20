const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const postSchema=new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model("users",postSchema);