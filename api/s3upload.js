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

const ARTICLE_MIME_EXT = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const ARTICLE_FIELD_BASE = {
    coverLetter: 'cover_letter',
    supplementary: 'supplementary',
};

const INVALID_ARTICLE_FILE = 'Only PDF and Word files are allowed';

const articleFileExtension = (file) => {
    if (file?.mimetype && ARTICLE_MIME_EXT[file.mimetype]) {
        return ARTICLE_MIME_EXT[file.mimetype];
    }
    const match = String(file?.originalname || '').toLowerCase().match(/\.(docx|pdf|doc)$/);
    return match ? match[1] : null;
};

const manuscriptBaseForStage = (stage) => (stage === 'edit' ? 'in_edit' : 'in_review');

// Uploading ArticleFiles to AWS

 const uploadWithMulter = (awsId, stage) => multer({
    fileFilter: (req, file, cb) => {
        if (!articleFileExtension(file)) {
            cb(new Error(INVALID_ARTICLE_FILE));
            return;
        }
        cb(null, true);
    },
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
            const ext = articleFileExtension(file);
            const base = file.fieldname === 'manuscript'
                ? manuscriptBaseForStage(stage)
                : ARTICLE_FIELD_BASE[file.fieldname];
            if (!ext || !base) {
                cb(new Error(INVALID_ARTICLE_FILE));
                return;
            }
            cb(null, `${userId}/${awsId}/${base}.${ext}`);
        }
    })
}).fields([
    { name: 'manuscript', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'supplementary', maxCount: 1 },
]);

const removeReplacedArticleFiles = async (userId, awsId, keptKeys) => {
    const existingObjects = await s3.listObjectsV2({
        Bucket: BUCKET_NAME,
        Prefix: `${userId}/${awsId}/`
    });
    const objects = (existingObjects.Contents || [])
        .filter((obj) => !obj.Key.startsWith(`${userId}/${awsId}/RejectionFiles/`) && !keptKeys.has(obj.Key))
        .map((obj) => ({ Key: obj.Key }));
    if (objects.length === 0) return;
    await s3.deleteObjects({
        Bucket: BUCKET_NAME,
        Delete: { Objects: objects }
    });
};

export const uploadToAWS = async (req, res) => {
    const { awsId } = req.params;
    const userId = req.userId;
    const stage = req.query.stage;
console.log(awsId,userId,'awsId and userId');
    if (stage !== 'review' && stage !== 'edit') {
        return res.status(400).json({ message: 'Upload stage must be review or edit' });
    }

    const upload = uploadWithMulter(awsId, stage);
    upload(req, res, async (err) => {
        if (err) {
            const message = err.message || 'An error occurred';
            const status = message === INVALID_ARTICLE_FILE ? 400 : 500;
            res.status(status).json({ message, error: message });
            return;
        }
        const manuscript = req.files?.manuscript?.[0];
        if (!manuscript) {
            res.status(400).json({ message: 'A manuscript file is required' });
            return;
        }
        try {
            const keptKeys = new Set();
            const remember = (field, base) => {
                const file = req.files?.[field]?.[0];
                const ext = file ? articleFileExtension(file) : null;
                if (ext) keptKeys.add(`${userId}/${awsId}/${base}.${ext}`);
            };
            remember('manuscript', manuscriptBaseForStage(stage));
            remember('coverLetter', ARTICLE_FIELD_BASE.coverLetter);
            remember('supplementary', ARTICLE_FIELD_BASE.supplementary);
            await removeReplacedArticleFiles(userId, awsId, keptKeys);
            const ext = articleFileExtension(manuscript);
            const manuscriptName = `${manuscriptBaseForStage(stage)}.${ext}`;
            res.status(200).json({ message: 'Files uploaded successfully', files: req.files, manuscriptName });
        } catch (cleanupErr) {
            console.error('Error:', cleanupErr);
            res.status(500).json({ message: 'An error occurred', error: cleanupErr.message });
        }
    });
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

//---------------- CV upload and get URL Logic  -----------------

// Uploading CV to AWS
const uploadWithMulterCV = (userId) => multer({
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            const date = new Date().toISOString();
            console.log(file, 'file in metadata');
            cb(null, { fieldName: file.fieldname, uploadDate: date });
        },
        key: function (req, file, cb) {
            const fileName = `cv/${userId}/${file.originalname}`
            cb(null, fileName)
        }
    })
}).single('cvFile');

export const uploadCVToAWS = async (req, res) => {
    const { userId } = req.params;
    console.log(userId, 'userId in CV upload');
    try {
        // Upload new file
        const upload = uploadWithMulterCV(userId);
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred', error: err });
            } else {
                res.status(200).json({ message: 'CV uploaded successfully', file: req.file });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
};

// Get CV file URL to store in db
export const fetchCVFile = async (req, res) => {
    const { userId } = req.params;
    try {
        const data = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/`
        let urlArr = []
        console.log(data, 'data from s3');
        const filteredData = data.Contents.filter((file) => file.Key.includes(`cv/${userId}/`))

        filteredData.map((file) => {
            urlArr.push(baseUrl + file.Key)
        })

        res.status(200).json({ message: 'CV file fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}