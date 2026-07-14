const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert buffer to data URI
    const fileBase64 = req.file.buffer.toString('base64');
    const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'lumera_products',
      resource_type: 'auto'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
