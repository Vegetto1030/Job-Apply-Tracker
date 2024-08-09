const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('profile', { user });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email } = req.body;
        const updatedFields = { firstname, lastname, email };

        // Mise à jour de l'image de profil
        if (req.files['profilePicture']) {
            const uploadResult = await cloudinary.uploader.upload(req.files['profilePicture'][0].path, {
                upload_preset: 'qjskklo1'
            });
            updatedFields.profilePicture = uploadResult.secure_url;
        }

        // Mise à jour du CV
        if (req.files['cv']) {
            const uploadResult = await cloudinary.uploader.upload(req.files['cv'][0].path, {
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
