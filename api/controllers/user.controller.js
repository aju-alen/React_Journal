
import jwt from 'jsonwebtoken'

export const deleteUser = async (req, res, next) => {
   
}

export const getUser = async (req, res, next) => {
   res.status(200).json({message:'User fetched successfully'})
}