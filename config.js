const endpoint = process.env.COSMOS_ENDPOINT || 'https://localhost:8081';
const key = process.env.COSMOS_KEY || '';

const config = {
  endpoint,
  key,
  databaseId: 'Tasks',
  containerId: 'Items',
  partitionKey: { kind: 'Hash', paths: ['/category'] },
};

module.exports = config;
