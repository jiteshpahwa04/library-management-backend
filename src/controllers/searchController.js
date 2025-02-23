const searchService = require('../services/searchService');

exports.searchHandler = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }

    const results = await searchService.search(query, page, size);
    res.status(200).json({ results });
  } catch (error) {
    console.error('Error in searchBooks controller:', error);
    res.status(500).json({ error: error.message });
  }
};