
const Profile = require("../models/profile");
const User = require("../models/User");

//update profile handler ---> bcz a null profile object was already created at the time of signup --> No need of creating new


exports.updateProfile = async (req , res) =>{
    try{

        //fetch details from req body
        const{dateOfBirth="" , about="" , gender , contactNumber} = req.body ;

        //fetch user id 
        const userId = req.user.id ;

        //validation
        if(!contactNumber || !gender || !userId ){
            return res.status(400).json({
                success:false,
                message:"All fields are required" ,
            })
        }

        //find profile
        const userDetails = await User.findById(userId) ;
        const profileId = userDetails.additionalDetails ;
        const profileDetails = await profile.findById(profileId) ;

        //update profile
        profileDetails.dateOfBirth = dateOfBirth ;
        profileDetails.about = about ;
        profileDetails.gender = gender ;
        profileDetails.contactNumber = contactNumber ;

        await profileDetails.save() ;   

        //return response

        return res.status(200).json({
            success:true ,
            message:"Profile updated successfully"
        })


    }catch(error){  

        return res.status(500).json({
            success:false,
            message:"Error in updating profile details"
        })

    }
}

//deleteAccount Handler
//HW -- how can we schedule account deletion
exports.deleteAccount = async (req , res) =>{
    try{

        //fetch user id
        const userId = req.user.id;

        //validation
        const userDetails = await User.findById(userId) ;
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"   
            })
        }

        //delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails}) ;
        //TODO -- Unenroll user from all unenrolled courses 
        //delete User
        await User.findByIdAndDelete({_id:userId});

        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in deleting User"
        })
    }
}

