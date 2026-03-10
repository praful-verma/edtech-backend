
const { findOneAndUpdate } = require("../models/OTP");
const User = require("../models/User")

//reset-password token
exports.resetPasswordToken = async (req,res) =>{
    try{
        //fetch email from req
        const {email} = req.body ;

        //find email exist or not
        const user = await User.findOne({email}) ;

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not Exist!"
            })
        }

        //generate token 
        const token = crypto.randomUUID() ;

        //update user in DB by adding token and reset-pwd expiry time

        const updatedDetails = await User.findOneAndUpdate(
                                                        {email:email} ,
                                                        {
                                                            token:token,
                                                            resetPasswordExpires:Date.now() + 5*60*1000
                                                        },
                                                        {new:true});

        //create URL for reset pwd
        const url = `http://localhost:3000/update-password/${token}`  ;
        
        //send mail containing url
        await mailSender(email , 
                         "password reset link",
                         `password reset link: ${url}`);

        //return response
        return res.json({
            success:true,
            message:"Email check Successfully , please check email and change pwd"
        });



    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset pwd mail"
        })
    }
}


//resetpassword 

exports.resetPassword = async (req , res) =>{
    try{

        //fetch details from request body
        const {password , confirmPassword , token} = req.body ;

        //password validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"password & confirmPassword not match"
            })
        }
        //get user details from DB
        const userDetails = await User.findOne({token});

        //if no user found
        if(!userDetails){
            return res.json({
                success:false,
                message:"Invalid Token"
            });
        }

        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token Expired"
            })
        }

        //hash pwd
        const hashedPassword = bcrypt.hash(password , 10) ;

        //pwd update

        await User.findOneAndUpdate(
                                    {token:token} ,
                                    {
                                        token : token,
                                        password:hashedPassword,

                                    },
                                    {new:true}) ;
        //return response
        return res.status(200).json({
            status:true,
            message:"Password Reset Successful"
        });



    }catch(error){
    return res.status(500).json({
        status:false,
        message:"Something went wrong while sending reset pwd email"
    })
    }
}