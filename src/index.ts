import http from 'http';
import { getPool } from './db';

const server = http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        try {
            const pool = await getPool();
            const result = await pool.request().query('SELECT TOP 5 * FROM Products');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.recordset));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Database error', details: err }));
            console.error(err);
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
