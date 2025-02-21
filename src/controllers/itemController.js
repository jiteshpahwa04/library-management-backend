const { createItem } = require('../services/itemService');

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
    if(req.files!=null){
      const files = req.files;
      fileUrls = files.map((file)=>{
        return "/uploads" + "/" + file.filename;
      });
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
