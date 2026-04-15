const mongoose = require('mongoose');
const fs = require('fs');

// Read .env.local manually to get MONGODB_URI
const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoLine = envFile.split(/\r?\n/).find(line => line.startsWith('MONGODB_URI='));
// Get everything after the first '='
const MONGODB_URI = mongoLine ? mongoLine.substring(mongoLine.indexOf('=') + 1).trim().replace(/^"|"$/g, '') : null;

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    sessionToken: { type: String }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function reset() {
    try {
        if (!MONGODB_URI) {
            console.error("MONGODB_URI not found in .env.local!");
            process.exit(1);
        }
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB.");

        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            console.log("No admins found, creating the default admin.");
            await Admin.create({
                email: 'admin@rmart.com',
                password: 'admin123',
                name: 'Super Admin'
            });
            console.log("Default admin created: admin@rmart.com / admin123");
        } else {
            const result = await Admin.updateMany({}, { $set: { password: 'admin123' } });
            console.log(`Password reset to 'admin123' for ${result.modifiedCount} admin user(s).`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reset();
