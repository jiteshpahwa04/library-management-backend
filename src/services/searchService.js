const esClient = require('../config/elasticsearch');

// SEARCH FUNCTION
exports.search = async (query, page = 1, size = 10) => {
    const from = (page - 1) * size;
    const searchQuery = {
        index: 'items',
        body: {
            query: {
                multi_match: {
                    query,
                    fields: ['title^4', 'authors^3', 'content^2', 'otherTitles', 'subjectKeywords', 'abstract', 'description']
                }
            }
        }
    };

    const esResponse = await esClient.search(searchQuery);
    return esResponse.hits.hits.map(hit => hit._source);
};