// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('demo2');

// Create a new document in the collection.
db.getCollection('users').insertOne({
    email: 'admin@gmail.com',
    password: '$2b$10$rs.rn6IcPa1oycUH8h7P8.Zx.qkGzLWbWjdJNvuHw.Muu9R8UMeLa',
    isAdmin: true
});
