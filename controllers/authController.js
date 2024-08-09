const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const cloudinary = require('../config/cloudinary');
const { generateSignedUrl } = require('../utils/cloudinaryService'); // Importer la fonction pour générer des URLs signées

exports.registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const newUser = new User({
            firstname,
            lastname,
            email,
            password
        });

        // Upload de l'image de profil
        if (req.files['profilePicture']) {
            const profilePicture = req.files['profilePicture'][0].path;
            const uploadResult = await cloudinary.uploader.upload(profilePicture, {
                upload_preset: 'qjskklo1'
            });
            newUser.profilePicture = uploadResult.secure_url;
        }

        // Upload du CV
        if (req.files['cv']) {
            const cvFile = req.files['cv'][0].path;
            const uploadResult = await cloudinary.uploader.upload(cvFile, {
                upload_preset: 'qjskklo1',
                resource_type: "auto"
            });
            newUser.cv = uploadResult.secure_url;
        }

        await newUser.save();
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).send(error.message);
  }
};

exports.renderProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      // Utilisez le publicId exact du fichier sur Cloudinary
      const cvPublicId = user.cv ? user.cv : null;
      const signedCvUrl = cvPublicId ? generateSignedUrl(cvPublicId) : null;
  
      res.render('profile', { user, signedCvUrl });
    } catch (error) {
      console.error('Error rendering profile:', error);
      res.status(500).send('Server Error');
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email } = req.body;
        const updatedFields = { firstname, lastname, email };

        // Upload de l'image de profil
        if (req.files['profilePicture']) {
            const profilePicture = req.files['profilePicture'][0].path;
            const uploadResult = await cloudinary.uploader.upload(profilePicture, {
                upload_preset: 'qjskklo1'
            });
            updatedFields.profilePicture = uploadResult.secure_url;
        }

        // Upload du CV
        if (req.files['cv']) {
            const cvFile = req.files['cv'][0].path;
            const uploadResult = await cloudinary.uploader.upload(cvFile, {
                upload_preset: 'qjskklo1',
                resource_type: "auto"
            });
            updatedFields.cv = uploadResult.secure_url;
        }

        await User.findByIdAndUpdate(userId, updatedFields);
        res.redirect('/auth/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
};