const mongoose = require('mongoose');
const env = require('../config/env');

function withDbName(uri, dbName) {
  return uri.replace(/\/([^/?]*)\?/, `/${dbName}?`);
}

async function syncCollection(sourceDb, targetDb, name) {
  const sourceDocs = await sourceDb.collection(name).find({}).toArray();
  if (sourceDocs.length === 0) {
    console.log(`[${name}] No documents found in source.`);
    return;
  }

  const operations = sourceDocs.map((doc) => ({
    replaceOne: {
      filter: { _id: doc._id },
      replacement: doc,
      upsert: true
    }
  }));

  const result = await targetDb.collection(name).bulkWrite(operations, { ordered: false });
  const upserted = result.upsertedCount || 0;
  const modified = result.modifiedCount || 0;
  const matched = result.matchedCount || 0;
  console.log(`[${name}] Synced ${sourceDocs.length} docs (upserted: ${upserted}, modified: ${modified}, matched: ${matched}).`);
}

async function run() {
  const sourceUri = withDbName(env.mongodbUri, 'test');
  const targetUri = withDbName(env.mongodbUri, 'event_management');

  const sourceConn = await mongoose.createConnection(sourceUri, {
    serverSelectionTimeoutMS: 10000
  }).asPromise();
  const targetConn = await mongoose.createConnection(targetUri, {
    serverSelectionTimeoutMS: 10000
  }).asPromise();

  try {
    const sourceDb = sourceConn.db;
    const targetDb = targetConn.db;

    await syncCollection(sourceDb, targetDb, 'users');
    await syncCollection(sourceDb, targetDb, 'events');
    await syncCollection(sourceDb, targetDb, 'registrations');

    console.log('Sync complete: test -> event_management');
  } finally {
    await sourceConn.close();
    await targetConn.close();
  }
}

run().catch((error) => {
  console.error('Sync failed:', error.message);
  process.exitCode = 1;
});
