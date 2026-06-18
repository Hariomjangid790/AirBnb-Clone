const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({  // configure ka mtlab hota hai cheejo ko jodna here cloudinary ko backend se jodne ke liye
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'wanderlust_DEV', // The name of the folder in your Cloudinary account
  allowedFormats: ['jpg', 'png', 'jpeg'],
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
});

module.exports = { cloudinary, storage };