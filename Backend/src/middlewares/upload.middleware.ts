import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only .csv files are allowed!'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 5MB limit
    }
});

export default upload;
