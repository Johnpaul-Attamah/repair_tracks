import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    } 
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image.png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb({message: 'Unsupported File Format'}, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 8 },
    fileFilter: fileFilter
});

export default upload;