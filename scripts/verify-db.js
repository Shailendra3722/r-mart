const mongoose = require('../node_modules/mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('Error: MONGODB_URI is not defined in the environment.');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
// Masking the URI for security in logs, showing only protocol and host if possible
const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
console.log(`URI: ${maskedUri}`);

mongoose.connect(uri)
    .then(() => {
        console.log('Database connection successful!');
        console.log(`Connected to host: ${mongoose.connection.host}`);
        console.log(`Database name: ${mongoose.connection.name}`);
        return mongoose.disconnect();
    })
    .then(() => {
        console.log('Disconnected successfully.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });
