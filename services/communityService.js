const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../config/cloudinaryConfig');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

const prisma = new PrismaClient();

async function createCommunity(userId, name, shortDescription, introductoryText, copyrightText, news, logo) {
    try {
        if (!logo.mimetype.startsWith('image/')) {
            return new Error('Only image file is allowed!');
        }

        // Upload image to Cloudinary
        const cloudinaryResponse = await uploadImageToCloudinary(
            logo,
            process.env.FOLDER_NAME
        )

        // Save the community with the Cloudinary image URL
        return prisma.community.create({
            data: {
                name,
                shortDescription,
                introductoryText,
                copyrightText,
                news,
                createdById: userId,
                logoUrl: cloudinaryResponse.secure_url,
            },
        });
    } catch (error) {
        throw new Error('Error uploading logo to Cloudinary: ' + error.message);
    }
}

module.exports = { createCommunity };