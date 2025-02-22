const prisma = require("../config/prismaClient");

async function createCollection(data, logoUrl) {
    try {
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