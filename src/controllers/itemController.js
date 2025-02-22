const { createItem } = require('../services/itemService');
const pdfParse = require('pdf-parse');
const fs = require("fs");

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF.');
  }
}

async function createItemHandler(req, res) {
  try {
    const data = JSON.parse(req.body.item);
    const creatorId = req.user.userId;

    // Validate required fields
    if (!data.title || !data.dateOfIssue || !data.types || !data.collectionId) {
      return res.status(400).json({ error: 'Title, Date of Issue, and Types are required' });
    }
    if (!data.licenseConfirmed) {
      return res.status(400).json({ error: 'License is required' });
    }

    let fileUrls = null;
    let contentArr = null;
    if(req.files!=null){
      const files = req.files;
      contentArr = [];
      fileUrls = [];
      for(let file of files){
        let dataBuffer = fs.readFileSync(file.path);
        const data = await extractTextFromPDF(dataBuffer);
        contentArr.push(data);
        fileUrls.push("/uploads/"+file.filename);
      }
    }

    if(contentArr!=null){
      data.content = contentArr;
    }
    data.creatorId = creatorId;

    const item = await createItem(
      data,
      fileUrls
    );

    return res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createItemHandler };
