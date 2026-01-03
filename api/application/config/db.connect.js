import mysql from 'mysql2';
import dotenv from 'dotenv';
import { AsyncLocalStorage } from 'async_hooks';
import { databaseCredentialsMap } from '../../databasesList.js';
dotenv.config();

const __poolsMap = new Map();

export async function getPool(dbId, dbName) {
    if (!dbName || !dbName) return undefined;

    if (!databaseCredentialsMap[dbId]) {
        throw new Error(`Unknown DB id: ${dbId}`);
    }

    const poolKey = `${dbId}:${dbName}`;

    if (__poolsMap.has(poolKey)) {
        const pool = __poolsMap.get(poolKey);
        return { pool, poolPromise: pool.promise() };
    }

    const cfg = databaseCredentialsMap[dbId];
    const pool = mysql.createPool({
        host: cfg.DB_HOST,
        user: cfg.DB_USER,
        password: cfg.DB_PASSWORD,
        database: dbName,
        port: cfg.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: cfg.connectionLimit ?? 10,
        queueLimit: 0,
    });

    // await useDb(pool, dbName); // Not needed as createPool sets the DB

    __poolsMap.set(poolKey, pool);
    return { pool, poolPromise: pool.promise() };
}

// async function useDb(pool, dbName) {
//     await pool.promise().query(`USE ${dbName}`);
// }

export const dbStore = new AsyncLocalStorage();
const dbProxy = new Proxy(
    {},
    {
        get(target, prop) {
            const store = dbStore.getStore();
            if (store && store.pool) {
                return Reflect.get(store.pool, prop);
            }
            throw new Error('No database connection available. Please login to select a database.');
        },
    }
);

export default dbProxy;
