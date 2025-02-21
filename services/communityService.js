const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCommunity(userId, name, shortDescription, introductoryText, copyrightText, news, parentCommunity, logoUrl) {
    try {
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

        const alreadyPresentCommunity = await prisma.community.findUnique({
            where: {
                name: name
            }
        })
        if(alreadyPresentCommunity!=null){
            throw new Error("A community already present with same name");
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
                logoUrl
            },
        });
    } catch (error) {
        throw new Error('Error creating the community: ' + error.message);
    }
}

module.exports = { createCommunity };