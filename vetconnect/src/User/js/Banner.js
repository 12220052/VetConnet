import React, { useEffect, useState } from 'react';
import { Image } from 'cloudinary-react';

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };

export default function Banner() {
    const [imageIds, setImageIds] = useState();
    const loadImages = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/images');
            const data = await res.json();
            setImageIds(data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadImages();
    }, []);
    return (
        <div>
            <h1 className="title">Cloudinary Gallery</h1>
            <div className="gallery">
                {imageIds &&
                    imageIds.map((imageId, index) => (
                        <Image
                            key={index}
                            cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                            publicId={imageId}
                            width="300"
                            crop="scale"
                        />
                    ))}
            </div>
        </div>
    );
}
