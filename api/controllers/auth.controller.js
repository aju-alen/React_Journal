import  jsonWebToken  from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import createError from '../utils/createError.js'

const prisma = new PrismaClient();
export const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const finduser = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (finduser) {
            return next(createError(400, 'User already exists'))
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hash,
                title: req.body.title,
                surname: req.body.surname,
                otherName: req.body.otherName,
                affiliation: req.body.affiliation,
                label: req.body.label,
                value: req.body.value
            }
        })
        await prisma.$disconnect()
        res.status(201).json({ message: 'User created successfully', user })
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}

export const login = async (req, res,next) => {
   try{
    const finduser = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })
    if (!finduser) {
        return next(createError(400, 'User does not exists'))
    }
    let isCorrect = bcrypt.compareSync(req.body.password, finduser.password)
    if (!isCorrect) {
        return res.send('Wrong password or username')
    }
    const token = jwt.sign({
        id:finduser.id,
        
    },"SECRET")
    await prisma.$disconnect()
    res.cookie("accessToken",token,{httpOnly:true,secure:true}).status(201).json(finduser)
   }
   catch(err){
    console.log(err);
    res.status(400).send('An error occoured')
   }
}
export const logout = async (req, res) => {

}