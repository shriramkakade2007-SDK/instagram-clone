// --- FINAL WORKING SERVER ---
// This server is now correctly configured to find and serve your 'index.html' file.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Set CORS headers to allow the browser to communicate with the server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- ROUTE 1: Serve the main HTML page ---
    if (req.url === '/' && req.method === 'GET') {
        // UPDATED: Now looking for the correct filename 'index.html'
        const filePath = path.join(__dirname, 'index.html');
        console.log(`Request received: GET /. Attempting to serve file: ${filePath}`);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                console.error(`CRITICAL ERROR: Could not read index.html file. [${err}]`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: index.html file not found.');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }

    // --- ROUTE 2: Handle the login form data ---
    else if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('\n--- LOGIN ATTEMPT RECEIVED ---');
            try {
                const data = JSON.parse(body);
                console.log('Username:', data.username);
                console.log('Password:', data.password);
                console.log('----------------------------\n');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Login data received successfully!' }));
            } catch (error) {
                console.error('Error parsing JSON from login attempt:', error);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request: Invalid data format.');
            }
        });
    }
    
    // --- If no route is matched ---
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`\nServer is running on http://localhost:${PORT}`);
    console.log('Open this URL in your browser to see the login page.');
    console.log('Submitted login details will appear here in the terminal.');
});

