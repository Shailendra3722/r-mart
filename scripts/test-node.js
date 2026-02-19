const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('Node works with built-in modules.');
console.log('CWD:', process.cwd());

try {
    const nm = path.join(process.cwd(), 'node_modules');
    console.log('Checking node_modules at:', nm);
    const stats = fs.statSync(nm);
    console.log('node_modules exists:', stats.isDirectory());
    console.log('node_modules mode:', stats.mode);
} catch (e) {
    console.error('Error accessing node_modules:', e.message);
    if (e.code === 'EACCES' || e.code === 'EPERM') {
        console.error('Permission denied. Please check directory permissions.');
    }
}
