
const User = require("../models/user")
const Tag = require("../models/Tag");
const { uploadToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");

//create course handler function
exports.createCourse = async (req , res) => {
    try{

        //fetch course data from req ki body
        const {courseName ,
                courseDescription , 
                whatYouWillLearn ,
                price , 
                tag} = req.body ;

        //fetch thumbnail

        const {thumbnail} = req.files.thumbnailImage ;

        //data validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required" 
            })
        }

        //check for instructor
        const userId = req.user.id ;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails -->" , instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instuctor not found" 
            })
        }

        //check given tag is valid or not

        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag not found" 
            })
        }

        //upload image to cloudinary

        const thumbnailImage = await uploadToCloudinary(thumbnail , process.env.FOLDER_NAME) ;

        //create entry for new course in DB

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn ,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url   
        })

        //add the new course to instructors data

        await User.findByIdAndUpdate(
                {id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id ,
                }
            },{new : true}) ;

        //update tag schema

        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse
        })

    }catch(err){
        return res.status(400).json({
            success:false,
            message:""
        })
    }
}


//get all courses handler function

exports.getAllCourses = async (req , res) => {
    try{

        const allCourses = await Courses.find({} , 
                                                {name:true,
                                                courseDescription:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentEnrolled:true,})
                                                .populate("instructor")
                                                .exec() ;

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to get all courses data"
        })
    }
}