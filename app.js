require('dotenv').config();

const config = require('./config');
const dbContext = require('./data/databaseContext');
const { CosmosClient } = require('@azure/cosmos');

async function main() {
  const { endpoint, key, databaseId, containerId, partitionKey } = config;

  // Create the client
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Create the database and container, if they do not exist
  await dbContext.create(client, databaseId, containerId, partitionKey);

  // Query items
  console.log(`Querying container: ${containerId}`);

  // Query the database for all items and display them on the console
  const querySpec = { query: 'SELECT * FROM c' };
  const query = container.items.query(querySpec);
  const { resources: items } = await query.fetchAll()
  for (const item of items) {
    console.log(`${item.id} - ${item.description}`);
  }
  // for await (const item of query.getAsyncIterator()) {
  //   console.log(`${item.id} - ${item.description}`);
  // }

  // Create a new item
  const newItem = {
    id: '4',
    category: 'fun',
    name: 'Cosmos DB',
    description: 'Complete Cosmos DB Node.js Quickstart ⚡',
    isComplete: false,
  };
  const { resource: createdItem } = await container.items.create(newItem);
  console.log(
    `\nCreated new item: ${createdItem.id} - ${createdItem.description}\n`
  );

  // Update the item
  createdItem.isComplete = true;
  const { resource: updatedItem } = await container
    .item(createdItem.id, createdItem.category)
    .replace(createdItem);
  
  // const { resource: updatedItem } = await container
  //   .item(createdItem.id, createdItem.category)
  //   .patch([{ op: 'set', path: '/isComplete', value: true }]);

  console.log(`Updated item: ${updatedItem.id} - ${updatedItem.description}`);
  console.log(`Updated isComplete to ${updatedItem.isComplete}\n`);

  // Delete the item
  const { resource: deletedItem } = await container
    .item(createdItem.id, createdItem.category)
    .delete();
  console.log(`Deleted item with id: ${createdItem.id}`);
}

main()
  .then(() => console.log('Done.'))
  .catch((err) => console.error(err.message));
