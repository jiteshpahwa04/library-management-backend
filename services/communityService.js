const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../config/cloudinaryConfig');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

const prisma = new PrismaClient();

async function createCommunity(userId, name, shortDescription, introductoryText, copyrightText, news, parentCommunity, logo) {
    try {
        if (!logo.mimetype.startsWith('image/')) {
            return new Error('Only image file is allowed!');
        }

        if(parentCommunity!=undefined && parentCommunity!=null){
            const community = await prisma.community.findUnique({
                where: {
                    id: parentCommunity
                }
            });
            if(community==null){
                return new Error("Parent community not found");
            }
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
                parentCommunity,
                createdById: userId,
                logoUrl: cloudinaryResponse.secure_url,
            },
        });
    } catch (error) {
        throw new Error('Error uploading logo to Cloudinary: ' + error.message);
    }
}

module.exports = { createCommunity };