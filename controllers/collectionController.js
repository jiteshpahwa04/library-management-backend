const { createCollection } = require('../services/collectionService');

async function createCollectionHandler(req, res) {
  try {
    const { name, introductoryText, shortDescription, copyrightText, news, license, communityId } = req.body;
    
    if (!name || !communityId) {
      return res.status(400).json({ error: 'Name and community are required' });
    }

    const creatorId = req.user.userId;
    const logoUrl = req.file!=null ? "/uploads" + "/" + req.file.filename : null;
    const collection = await createCollection(
      { name, introductoryText, shortDescription, copyrightText, news, license, communityId, creatorId },
      logoUrl
    );

    return res.status(201).json({ message: 'Collection created successfully', collection });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createCollectionHandler };