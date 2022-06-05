import config from 'config';
import { CosmosClient } from '@azure/cosmos';

try {
  // Get cosmos configuration
  const {
    endpoint,
    key,
    databaseId,
    containerId,
    partitionKey,
    offerThroughput,
  } = config.get('cosmos');

  // Create the client
  const client = new CosmosClient({ endpoint, key });

  // Create the database, if it does not exist
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(`Created database: ${database.id}\n`);

  // Create the container, if it does not exist
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: parseInt(offerThroughput) }
    );
  console.log(`Created container: ${container.id}\n`);

  // Query items
  console.log(`Querying container: ${containerId}`);

  // Query the database for all items and display them on the console
  const querySpec = { query: 'SELECT * FROM c' };
  const query = container.items.query(querySpec);
  const { resources: items } = await query.fetchAll();
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
} catch (err) {
  console.error(err.message);
}
