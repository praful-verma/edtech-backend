const mongoose = require("mongoose") ;

const course = new mongoose.Schema({

    courseName:{
        type:String,
    },
    description:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
        type:mongoose.Schema.Types.ObjectId ,
        ref:"Section"
    }],
    
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"RatingsAndReviews"
    }],
    thumbnail:{
        type:String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"Tag" ,

    },
    studentsEnrolled:[{
        
        type:mongoose.Schema.Types.ObjectId ,
        required:true,
        ref:"User"
    }]


}) ;

module.exports = mongoose.model("Course" , course);