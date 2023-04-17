const multer = require('multer');

// create a storage engine for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// create a multer middleware for handling file uploads
const upload = multer({ storage: storage });
module.exports = upload;
