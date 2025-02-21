const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCommunity(data, logoUrl) {
    try {
        if(data.parentCommunity!=undefined && data.parentCommunity!=null){
            const community = await prisma.community.findUnique({
                where: {
                    id: data.parentCommunity
                }
            });
            if(community==null){
                return new Error("Parent community not found");
            }
        }

        const alreadyPresentCommunity = await prisma.community.findUnique({
            where: {
                name: data.name
            }
        })
        if(alreadyPresentCommunity!=null){
            throw new Error("A community already present with same name");
        }

        return await prisma.community.create({
            data: {
                name: data.name,
                shortDescription: data.shortDescription,
                introductoryText: data.introductoryText,
                copyrightText: data.copyrightText,
                news: data.news,
                parentCommunity: data.parentCommunity,
                createdById: data.userId,
                logoUrl
            },
        });
    } catch (error) {
        throw new Error('Error creating the community: ' + error.message);
    }
}

module.exports = { createCommunity };