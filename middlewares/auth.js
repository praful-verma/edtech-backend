const jwt = require("jsonwebtoken");
require("dotenv").config() ;



//auth
exports.auth = async(req , res , next) =>{
    try{

        //extract token (any 1 of the three ways)

        const token = req.cookies.token
                        ||req.body.token
                        ||req.header("Authorisation").replace("Bearer" , "");

        //if token is missing , return response
        if(!token){
            return res.status(401).json({
                success:true,
                message:"Token is missing"
            })
        }  
        
        //verify token
        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode ;
        }catch(err){
            //verification issue
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }
        next() ;

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong"
        })
    }
}


//isStudent 

exports.isStudent = async(req , res , next) =>{
    try{
        //fetch role
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Students"
            })
        }
        next();
    }catch(error){
        res.status(500).json({
            success:false,
            message:"User role can not be verified , please try again later"
        })
    }
}

//isInstructor
exports.isInstructor = async(req , res , next) =>{
    try{
        //fetch role
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Instructor"
            })
        }
        next();
    }catch(error){
        res.status(500).json({
            success:false,
            message:"User role can not be verified , please try again later"
        })
    }
}

//isAdmin
exports.isAdmin = async(req , res , next) =>{
    try{
        //fetch role
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Admin"
            })
        }
        next();
    }catch(error){
        res.status(500).json({
            success:false,
            message:"User role can not be verified , please try again later"
        })
    }
}
