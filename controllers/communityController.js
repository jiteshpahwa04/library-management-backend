const communityService = require('../services/communityService');

async function createCommunity(req, res) {
  try {
    const { name, introductoryText, shortDescription, copyrightText, news, parentCommunity } = req.body;
    const { logo } = req.files;

    if (!logo) {
      return res.status(400).json({ message: 'Logo is required' });
    }
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const community = await communityService.createCommunity(req.user.userId, name, shortDescription, introductoryText, copyrightText, news, parentCommunity, logo);
    res.status(201).json({ message: 'Community created successfully', community });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { createCommunity };