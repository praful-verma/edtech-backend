

const OTP = require("../models/OTP") ;
const User = require("../models/user")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt") ;
const jwt = require("jsonwebtoken")



//send OTP

exports.sendOTP = async (req , res) =>{
    try{

        //fetch email 
        const {email} = req.body ;

        //check if user already exist
        const checkUserPresent = await User.findOne({email}) ;

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Exist"
            })
        }

        //generate OTP

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("OTP generated" , otp) ;

        //-----------------------check if OTP is unique

        //check if otp exist in db
        let result = await OTP.findOne({otp:otp}) ;

        //generate otp until unique otp not generated
        while(result){

            OTP = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        }) ;

        result = await OTP.findOne({otp:otp}) ;
        }

        const otpPayLoad = {email , otp} ;

        //create an entry on DB of generate otp

        const otpBody = OTP.create(otpPayload);
        console.log(otpBody) ; 
        
        
        //return response successfull

        return res.status(200).json({
            success:true,
            message:"OTP sent successfully" ,
            otp,
        })



    }catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
};


//signUp

exports.signUp = async(req , res) =>{
    try{
        //data fetch from req ki body
        const{
            firstName,
            lastName,
            email,
            contactNumber,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body ;

        //validate karo
        if(!firstName || !lastName || !email || !contact || !password || !confirmPassword || !accountType || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //2 password match krlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirmPassword does not match , try again"
            })
        }

        //check user already exist or not

        const existingUser = await User.findOne({email}) ;

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }

        
        //find most recent otp stored for the user

        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1) ;
        console.log(recentOtp) ;

        //validate OTP

        if(otp !== recentOtp.OTP){
            //InvalidOTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password , 10) ;

        //create entry in DB

        const profileDetails = await profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,   
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        //return res
        return res.status(200).json({
            success:true,
            message:"User is registered Successfully"
        })
    }catch(error){

        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in signUp"
        })

    }
}

//login

exports.login = async(req , res) =>{
    try{
        //fetch data from req body
        const {email , password} = req.body ;
        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required!" ,
            })
        }
        //check user exist in DB or nor
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registered , please signup first" ,
            });
        }
        //check password and generate JWT token 
        if(await bcrypt.compare(password , user.password)){
            const payload ={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
                password:user.password 
            }
             //JWT token creation
            const token = jwt.sign(payload , process.env.JWT_SECRET ,{
                expiresIn:"2h",
            });
            user.token = token ;
            user.password = undefined;

            //generate cookie & send response
        const options = {
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true
        }
        res.cookie("token" , token , options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in Successfully"
        })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password" 
            });
        }
        
        
        

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure , please try again later" ,
        })
    }
}

