const { createItem } = require('../services/itemService');

async function createItemHandler(req, res) {
  try {
    const {
      title,
      authors,
      otherTitles,
      dateOfIssue,
      publisher,
      citation,
      seriesReports,
      identifiers,
      types,
      language,
      subjectKeywords,
      abstract,
      sponsors,
      description,
      licenseConfirmed,
      collectionId
    } = req.body;

    const creatorId = req.user.userId;

    // Validate required fields
    if (!title || !dateOfIssue || !types || !collectionId) {
      return res.status(400).json({ error: 'Title, Date of Issue, and Types are required' });
    }
    if (!licenseConfirmed) {
      return res.status(400).json({ error: 'License is required' });
    }

    let fileUrls = null;
    if(req.files!=null){
      const files = req.files;
      fileUrls = files.map((file)=>{
        return file.filename;
      });
    }

    const item = await createItem(
      {
        title,
        authors,
        otherTitles,
        dateOfIssue,
        publisher,
        citation,
        seriesReports,
        identifiers,
        types,
        language,
        subjectKeywords,
        abstract,
        sponsors,
        description,
        licenseConfirmed,
        collectionId,
        creatorId
      },
      fileUrls
    );

    return res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createItemHandler };
