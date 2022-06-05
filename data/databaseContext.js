const { CosmosClient } = require('@azure/cosmos');

/**
 * This function ensures that the database is setup and populated correctly
 * @param {CosmosClient} client 
 * @param {string} databaseId 
 * @param {string} containerId 
 * @param {string} partitionKey 
 */
async function create(client, databaseId, containerId, partitionKey) {

  // Create the database, if it does not exist
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(`Created database:\n${database.id}\n`);

  // Create the container, if it does not exist
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}

module.exports = { create };
