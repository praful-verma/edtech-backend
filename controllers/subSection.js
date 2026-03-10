

//create subSection handler


const SubSection = require("../models/SubSection");

exports.createSubSection = async (req,res) =>{
    try{

        //fetch data from req body
        const {sectionId ,title , description , timeDuration } = req.body ;

        //fetch video file
        const video = req.files.videoFile ;

        //validation
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(400).json({
                success:false ,
                message:"All fields are required"
            });
        }
        
        //upload video to Cloudinary

        const uploadDetails = await uploadToCloudinary(video , process.env.FOLDER_NAME) ;

        //create sub-section
        
        const subSection = await SubSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:uploadDetails.secure_url,   
        }) ;

        //update Section with this subsection objectId 

        const updatedSection = await findByIdAndUpdate({_id:sectionId} ,
            {
                $push:{
                    subSection:subSectionDetails._id ,
                }
            },
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"subSection created successfully",
            updatedSection,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in subSection creation",
            error:error.message
        })
    }
}

