const prisma = require("../config/prismaClient");
const client = require('../config/elasticsearch');

async function createItem(data, fileUrls) {
  try {
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
        authors: data.authors,
        otherTitles: data.otherTitles,
        dateOfIssue: new Date(data.dateOfIssue),
        publisher: data.publisher || null,
        citation: data.citation || null,
        seriesReports: data.seriesReports,
        identifiers: data.identifiers,
        types: data.types,
        language: data.language || null,
        subjectKeywords: data.subjectKeywords || null,
        abstract: data.abstract || null,
        sponsors: data.sponsors || null,
        description: data.description || null,
        files: fileUrls,
        licenseConfirmed: data.licenseConfirmed === 'true',
        collectionId: data.collectionId,
        createdById: data.creatorId
      }
    });

    // await client.index({
    //   index: 'items',
    //   id: item.id,
    //   body: {data},
    // });

    return item;
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Failed to create item');
  }
}

module.exports = { createItem };
