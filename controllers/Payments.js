const {instance} = require("../config/razorPay")
const User = require("../models/User")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the Razorpay order

exports.capturePayment = async (req , res) =>{
    try{

        //fetch courseID
        const courseId = req.body ;
        //fetch userID
        const userId = req.user.id ;
        //validation
        //valid courseId
        if(!courseId){
            return res.status(400),json({
                success:false,
                message:"Please provide valid course ID"
            })
        }
        //valid course details

        let courseDetails = await Course.findById(courseId) ;
        try{
            
            courseDetails = await Course.findById(courseId) ;

            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:"Could not find course"
                }) ;
            }
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }

        //check if user already paid for the course

        const uid = new mongoose.Types.ObjectId(userId) ;
        if(courseDetails.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            });
        }

        //order create
        const amount = courseDetails.price ;
        const currency = "INR" ;
        
        const options = {
            amount : amount * 100 ,
            currency ,
            receipt:Math.random(Date.now()).toString() ;
            notes:{
                courseId:courseId,
                userId,
            }
        };

        try{
            //initiate payment using razorpay
            const paymentResponse = await instance.orders.create(options) ;
            console.log(paymentResponse) ;
            
            //return response
            return res.status(200).json({
                success:true,
                courseName:courseDetails.courseName,
                courseDescription:courseDetails.courseDescription,
                thumbnail:courseDetails.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount 
            });
        }catch(err){
            return res.status(400).json({
                success:false,
                message:err.message,
            })
        }

    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"could not initiate order"
        })
    }
}

//verify signature of Razorpay and  Server

exports.verifySignature = async (req ,res) =>{
    const webhookSecret = "12345678" ;

    //fetch signature from razorpay's req
    const signature = req.headers["x-razorpay-signature"] ;

    //converting webhookSecret into encrypted form to compare with the razrpay's signature
    const shasum = crypto.createHmac("sha256" , webhookSecret) ;
    shasum.update(JSON.stringify(req.body)) ;
    const digest = shasum.digest("hex") ;

    if(signature == digest){
        console.log("Payment is authorised");

        const{courseId , userId} = req.body.payload.payment.entity.notes

        try{
            //fulfill the action

            //find course and enroll the student in it
            const enrolledCourse = await Course.findById(
                                                        {_id:courseId},
                                                        {$push:{studentsEnrolled:userId}},
                                                        {new:true},

            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not found",
                })
            }
            console.log(enrolledCourse);

            //find the student and add the course to their list enrolled courses me
            const enrolledStudent = User.findOneAndUpdate(
                                                        {_id:userId},
                                                        {$push:{courses:courseId}},
                                                        {new:true}
            );

            console.log(enrolledStudent) ;

            //mail send karo confirmation vaala
            const emailResponse = await mailSender(
                                                    enrolledStudent.email,
                                                    "congrats",
                                                    "Go and study"
            );

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added" 
            });
        }

        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message ,
            })
        }
    }
}