import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).send("You are not authenticated!");

    jwt.verify(token,process.env.SECRET,async(err,payload)=>{
       
        if(err) return ResizeObserverSize.status(403).send("Token is not valid");
        req.userId = payload.id;
        req.isAdmin = payload.isAdmin;
        console.log(req.userId,'userId in verify');
        next()
    });
}