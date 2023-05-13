const {model,Schema}  = require("mongoose");
const passportLocalMongoose=require('passport-local-mongoose')

// const bcrypt=require('bcrypt')
const taskData = new Schema({
  title:{type:String,required:true},
    isCompleted:Boolean,

})

const tas=model('Task',taskData)

const NoteData = new Schema({
  title:{type:String,required:true},
  body:String,
    

})

const Notes=model('Note',NoteData)

const userScheme=new Schema({
  name:{type:String},
  username:{type:String,required:true},
  // NO NEED IT because passport-local-mongoose will make that
    // password:{type:String,required:true},
    task:[taskData],
    note:[NoteData]
},{timestamps:true})
// NO NEED IT because passport-local-mongoose will make that
// user.pre('save',async function () {
//     this.password=await bcrypt.hash(this.password,10)
// })

userScheme.plugin(passportLocalMongoose)
const user=model('Users',userScheme)

module.exports={tas,user}