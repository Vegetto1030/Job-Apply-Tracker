const cloudinary = require('../config/cloudinary');

const generateSignedUrl = (publicId) => {
  const options = {
    sign_url: true,
    type: 'authenticated',  // Assurez-vous que le type est correct
    secure: true,           // Utilisez HTTPS
    transformation: [{ width: 300, crop: "scale" }]
  };

  return cloudinary.url(publicId, options);
};

module.exports = { generateSignedUrl };
