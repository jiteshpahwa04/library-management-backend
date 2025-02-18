const { PrismaClient } = require('@prisma/client');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

const prisma = new PrismaClient();

async function createCollection(data, logo) {
    try {
        let logoUrl = null;
        if (logo != null) {
            const cloudinaryResponse = await uploadImageToCloudinary(
                logo,
                process.env.FOLDER_NAME
            )
            logoUrl = cloudinaryResponse.secure_url;
        }

        const community = await prisma.community.findUnique({
            where: {
                id: data.communityId
            }
        })
        if(community==null){
            throw new Error("Community not found!");
        }

        const collection = await prisma.collection.create({
            data: {
                name: data.name,
                introductoryText: data.introductoryText || null,
                shortDescription: data.shortDescription || null,
                copyrightText: data.copyrightText || null,
                news: data.news || null,
                license: data.license || null,
                logoUrl,
                communityId: data.communityId,
                createdById: data.creatorId
            }
        });

        return collection;
    } catch (error) {
        console.error('Error creating collection:', error);
        throw new Error('Failed to create collection');
    }
}

module.exports = { createCollection };