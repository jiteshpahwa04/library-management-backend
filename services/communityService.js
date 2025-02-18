const { PrismaClient } = require('@prisma/client');
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

        let cloudinaryResponse = null;
        if(logo!=null){
            cloudinaryResponse = await uploadImageToCloudinary(
                logo,
                process.env.FOLDER_NAME
            )
        }

        return prisma.community.create({
            data: {
                name,
                shortDescription,
                introductoryText,
                copyrightText,
                news,
                parentCommunity,
                createdById: userId,
                logoUrl: cloudinaryResponse!=null ? cloudinaryResponse.secure_url : null,
            },
        });
    } catch (error) {
        throw new Error('Error uploading logo to Cloudinary: ' + error.message);
    }
}

module.exports = { createCommunity };