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

// Uploading ArticleFiles to AWS

 const uploadWithMulter = (awsId) => multer({
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            const date = new Date().toISOString();
            console.log(file, 'file in metadata');
            cb(null, { fieldName: file.fieldname,uploadDate:date });
        },
        key: function (req, file, cb) {
            const userId = req.userId;
            const fileName = `${userId}/${awsId}/${file.originalname}`
            cb(null, fileName)
        }
    })
}).array('s3Files', 3);

export const uploadToAWS = async (req, res) => {
    const { awsId } = req.params;
    const userId = req.userId;
console.log(awsId,userId,'awsId and userId');
    try {
        // Delete all objects in the existing folder
        const listObjectsParams = {
            Bucket: BUCKET_NAME,
            Prefix: `${userId}/${awsId}/`
        };
        const existingObjects = await s3.listObjectsV2(listObjectsParams);
        console.log(existingObjects, 'existing objects');
       
        if (  existingObjects.Contents?.length > 0 ) {
            const deleteParams = {
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: existingObjects.Contents.filter(obj => !obj.Key.startsWith(`${userId}/${awsId}/RejectionFiles/`))
                    
                }
                
            };
           const resp = await s3.deleteObjects(deleteParams);
            console.log(resp,'deleted files');
        }

        // Upload new files
        const upload = uploadWithMulter(awsId);
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred', error: err });
            } else {
                res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
};

// Get all uploaded files URL to store in db
export const fetchAllFiles = async (req, res) => {
    try {
        const data = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/`
        let urlArr = []
        console.log(data,'data from s3');
        const filteredData = data.Contents.filter((file) => !file.Key.includes(`${req.userId}/${req.params.awsId}/RejectionFiles`) && file.Key.includes(`${req.userId}/${req.params.awsId}/`) )

        filteredData.map((file) => {
           
            urlArr.push(baseUrl + file.Key)
        })
     
        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}






// Sending Rejection Files to AWS

const uploadWithMulterAdmin = (awsId,id) => multer({
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            const date = new Date().toISOString();
            console.log(file, 'file in metadata');
            cb(null, { fieldName: file.fieldname,uploadDate:date });
        },
        key: function (req, file, cb) {
            const userId = req.userId;
            const fileName = `${id}/${awsId}/RejectionFiles/${file.originalname}`
            cb(null, fileName)
        }
    })
}).array('s3Files', 3);

export const uploadToAWSAdmin = async (req, res) => {
    const { awsId,userId } = req.params;
    console.log(req.userId, 'userId in upload',awsId);
    try {
        // Delete all objects in the existing folder
        const listObjectsParams = {
            Bucket: BUCKET_NAME,
            Prefix: `${userId}/${awsId}/RejectionFiles/`
        };
        const existingObjects = await s3.listObjectsV2(listObjectsParams);
        console.log(existingObjects, 'existing objects');
        if (  existingObjects.Contents?.length > 0 ) {
            const deleteParams = {
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: existingObjects.Contents.filter(obj => obj.Key.startsWith(`${userId}/${awsId}/RejectionFiles/`))
                }
            };
            await s3.deleteObjects(deleteParams);
        }

        // Upload new files
        const upload = uploadWithMulterAdmin(awsId,userId);
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred', error: err });
            } else {
                res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
};
 
// Get all Rejected uploaded files URL to store in db (Update RejectionFiles)
export const fetchAllFilesAdmin = async (req, res) => {
    const { userId,awsId } = req.params;
    try {
        const data = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/`
        let urlArr = []
        console.log(data,'data from s3');
        const filteredData = data.Contents.filter((file) => file.Key.includes(`${userId}/${awsId}/RejectionFiles`))

        filteredData.map((file) => {
           
            urlArr.push(baseUrl + file.Key)
        })
     
        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}



//---------------- Full Issue upload and get URL Logic  -----------------

// Uploading ArticleFiles to AWS

const uploadWithMulterFullIssue = (awsId) => multer({
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            const date = new Date().toISOString();
            console.log(file, 'file in metadata');
            cb(null, { fieldName: file.fieldname,uploadDate:date });
        },
        key: function (req, file, cb) {
            console.log(file, 'file in key');
            const fileName = `fullIssue/${awsId}/${file.originalname}`
            cb(null, fileName)
        }
    })
}).array('s3FullIssue', 2);


export const uploadToAWSFullIssue = async (req, res) => {
    const { awsId } = req.params;
console.log(awsId,'awsId and userId');
    try {
        // Upload new files
        const upload = uploadWithMulterFullIssue(awsId);
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred', error: err });
            } else {
                res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
};

// Get all uploaded FULL ISSUE files URL to store in db
export const fetchFullIssueFiles = async (req, res) => {
    const { awsId } = req.params;
    try {
        const data = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/`
        let urlArr = []
        console.log(data,'data from s3');
        const filteredData = data.Contents.filter((file) =>  file.Key.includes(`fullIssue/${awsId}/`) )

        filteredData.map((file) => {
           
            urlArr.push(baseUrl + file.Key)
        })
     
        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}