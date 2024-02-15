import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const verifyToken = (req,res,next)=>{
    console.log('this is accessToken',req.cookies);
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("You are not authenticated!");

    jwt.verify(token,process.env.SECRET,async(err,payload)=>{
        console.log(payload);
        if(err) return ResizeObserverSize.status(403).send("Token is not valid");
        next()
    });
}