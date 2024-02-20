import express from 'express';
import multer from 'multer';
import mutlerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const s3 = new S3({
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    },

    region: REGION
});

export const uploadWithMulter = () => multer({
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
}).array('s3Files', 3);

export const uploadToAWS = (req, res) => {
    const upload = uploadWithMulter();
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ message: 'An error occoured', error: err })
        }
        else {
            res.status(200).json({ message: 'File uploaded successfully', files: req.files })
        }
    })
}

export const fetchAllFiles = async (req, res) => {
    try {
        const res = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/`
        let urlArr = []
        res.Contents.map((file) => {
            urlArr.push(baseUrl + file.Key)
        })
        console.log(urlArr, 'res.Contents');
        
        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })

    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}






