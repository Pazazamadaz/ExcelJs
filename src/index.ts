import http from 'http';
import url from 'url';
import { getPool } from './db';
import { getAllTableNames, getTableSchema } from './services/tableServices';
import {generateExcelReport} from "./services/reportServices";
import { ReportRequest } from './types/reportRequest';
import {validateReportRequest} from "./utils/validateReportRequest";

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url || '', true);
    const method = req.method || 'GET';

    if (parsedUrl.pathname === '/' && method === 'GET') {
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
    }

    else if (parsedUrl.pathname === '/tables' && method === 'GET') {
        try {
            const tables = await getAllTableNames();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ tables }));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to fetch table list', details: err }));
        }
    }

    else if (parsedUrl.pathname === '/tableSchema' && method === 'GET') {
        const tableName = parsedUrl.query.table as string;

        if (!tableName) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing table query parameter' }));
            return;
        }

        try {
            const schema = await getTableSchema(tableName);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(schema));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to fetch schema', details: err }));
        }
    }

    else if (parsedUrl.pathname === '/report' && method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const requestBody: ReportRequest = JSON.parse(body);

                const validationErrors = validateReportRequest(requestBody);
                if (validationErrors.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid request', details: validationErrors }));
                    return;
                }

                const buffer = await generateExcelReport(requestBody);

                res.writeHead(200, {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': `attachment; filename=${requestBody.tableName}_report.xlsx`,
                });
                res.end(buffer);
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to generate report', details: err }));
            }
        });
    }

    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
