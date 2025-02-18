const { PrismaClient } = require('@prisma/client');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

const prisma = new PrismaClient();

async function createItem(data, files) {
  try {
    let fileDetails = [];
    for(let file of files){
        const cloudinaryResponse = await uploadImageToCloudinary(
            file,
            process.env.FOLDER_NAME
        )

        fileDetails.push(cloudinaryResponse);
    }

    const collection = await prisma.collection.findUnique({
        where: {
            id: data.collectionId
        }
    })
    if(collection==null){
        throw new Error("Collection not found!");
    }

    const item = await prisma.item.create({
      data: {
        title: data.title,
        authors: data.authors ? data.types.split(',') : [],
        otherTitles: data.otherTitles ? data.types.split(',') : [],
        dateOfIssue: new Date(data.dateOfIssue),
        publisher: data.publisher || null,
        citation: data.citation || null,
        seriesReports: data.seriesReports ? JSON.parse(data.seriesReports) : null,
        identifiers: data.identifiers ? JSON.parse(data.identifiers) : null,
        types: data.types.split(','),
        language: data.language || null,
        subjectKeywords: data.subjectKeywords || null,
        abstract: data.abstract || null,
        sponsors: data.sponsors || null,
        description: data.description || null,
        licenseConfirmed: data.licenseConfirmed === 'true',
        collectionId: data.collectionId,
        createdById: data.creatorId
      }
    });
    
    // create files
    for(const fileDetail of fileDetails){
        await prisma.file.create({
            data: {
                url: fileDetail.secure_url,
                type: fileDetail.resource_type,
                itemId: item.id,
                public_id: fileDetail.public_id
            }
        });
    }

    return item;
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Failed to create item');
  }
}

module.exports = { createItem };
