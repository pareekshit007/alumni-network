db = db.getSiblingDB('alumni_db');

db.createUser({
  user: "admin",
  pwd: "secret",
  roles: [{ role: "readWrite", db: "alumni_db" }]
});

// Create collections and indices
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

db.createCollection('jobs');
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ type: 1 });

db.createCollection('events');
db.events.createIndex({ date: 1 });

db.createCollection('conversations');
db.conversations.createIndex({ "participants": 1 });

db.createCollection('messages');
db.messages.createIndex({ conversation: 1 });
