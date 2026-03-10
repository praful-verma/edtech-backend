const Tag = require("../models/Tag") ;

//Create_tag Handler function

exports.createTag = async (req , res) =>{
    try{

        //fetch details from req 
        const {name , description} = req.body ;

        //validation
        if(!name || !description){
            return res.status(500).json({
                success:false ,
                message:"All fields are required" 
            })
        }

        //create entry in DB
        const tagDetails = await Tag.create({
                            name:name,
                            description:description
                            }
                            ) ;

        console.log(tagDetails) ;

        //return response

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"  
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong during Tag creation"
        })
    }
}


//show_all_tags handler function

exports.showAllTags = async (req ,res) =>{
    try{
        //fetch all tags form DB
        const allTags = await Tag.find({} , {name:true} , {description:true})

        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message ,
        })
    }
}