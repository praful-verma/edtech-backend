
const Course = require("../models/Course");
const Section = require("../models/Section");
const { findByIdAndDelete } = require("../models/User");


//createSection controller


exports.createSection = async (req , res) =>{
    try{

        //fetch details from req body
        const{sectionName , courseId} = req.body ;

        //validation of details
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        //insert section in DB
        const newSection = await Section.create({sectionName}) ;

        //insert section object id in Course
        const updatedCourseDetails = await Course.findByIdAndDelete(courseId ,
                                                                    {
                                                                        $push:{
                                                                            courseContent:newSection._id
                                                                        }
                                                                    },
                                                                    {new : true},
                                                                    )
        //return response

        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails ,   
        })

        
    }catch(error){
        
        return res.status(500).json({
            success:false,
            message:"Unable to create a section , please try again",
            error:error.message,
        });

    }
}


//update Section Handler

exports.updateSection = async (req , res) => {
    try{
        
        //fetch data
        const{sectionName , sectionId} = req.body ;
        
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }

        //update data

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName} , {new:true}) ;

        //return response

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            updatedSection ,   
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update Section , please try again",
            error:error.message,
        });
    }

}

//deleteSection handler

exports.deleteSection = async (req , res) =>{
    try{

        //get ID -- assuming that we are sending ID in params
        const {sectionId} = req.params ;

        //delete it 

        await Section.findByIdAndDelete(sectionId) ;

        //do we need delete it from Course Schema also??

        //return response
        
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
               
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to Delete Section , please try again",
            error:error.message,
        });
    }
}