const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Configure multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, adminOnly, upload.single('file'), uploadImage);

module.exports = router;
