const express = require('express');
const router = express.Router();
const  cloudinary = require('../Utils/cloudinary');  // Import configured Cloudinary

router.get('/api/images', async (req, res) => {
    try {
        const { resources } = await cloudinary.search
            .expression('folder:dev_setups')
            .sort_by('public_id', 'desc')
            .max_results(30)
            .execute();

        const publicIds = resources.map((file) => file.public_id);
        res.send(publicIds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Failed to fetch images' });
    }
});

router.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'vetconnect',  // Ensure this upload preset exists
        });
        console.log(uploadResponse);
        res.json({ msg: 'Image uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

module.exports = router;
