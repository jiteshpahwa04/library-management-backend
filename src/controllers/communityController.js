const communityService = require('../services/communityService');
const path = require("path");

async function createCommunity(req, res) {
  try {
    const data = JSON.parse(req.body.community);

    if (!data.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const logoUrl = req.file!=null ? "/uploads" + "/" + req.file.filename : null;
    data.userId = req.user.userId;
    const community = await communityService.createCommunity(data, logoUrl);
    res.status(201).json({ message: 'Community created successfully', community });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { createCommunity };