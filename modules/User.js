import mongoose from "mongoose"

const {Schema,model,Types} = mongoose

const schema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    links:[{
        type:Types.ObjectId,
        ref:"Link"
    }]
})

export default model("user", schema)
