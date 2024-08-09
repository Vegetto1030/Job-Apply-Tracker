const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Configure le stockage avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'job-apply-tracker', // Dossier sur Cloudinary
    allowed_formats: ['jpg', 'png', 'pdf'], // Formats de fichiers acceptés
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`
  },
});

// Fonction de filtrage des types de fichiers
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and PDFs only!');
  }
}

// Initialiser multer avec CloudinaryStorage
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limiter la taille des fichiers à 1 Mo
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

module.exports = upload;
