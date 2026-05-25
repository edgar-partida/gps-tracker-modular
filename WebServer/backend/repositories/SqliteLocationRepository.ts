import { Database } from 'sqlite';
import { Location } from '../domain/Location';
import { ILocationRepository } from './ILocationRepository';

export class SqliteLocationRepository implements ILocationRepository {
    constructor(private db: Database) { }

    async initialize(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                timestamp TEXT NOT NULL
            )
        `);
    }

    async save(location: Location): Promise<void> {
        await this.db.run(
            'INSERT INTO locations (latitude, longitude, timestamp) VALUES (?, ?, ?)',
            location.latitude,
            location.longitude,
            location.timestamp
        );
    }

    async findByDate(date?: string, hour?: string): Promise<Location[]> {
        let sql = 'SELECT latitude, longitude, timestamp FROM locations';
        const params: any[] = [];
        const filters: string[] = [];

        if (date) {
            filters.push('timestamp LIKE ?');
            params.push(`${date}%`);
        }

        if (hour) {
            filters.push('timestamp LIKE ?');
            params.push(`%T${hour.padStart(2, '0')}:%`);
        }

        if (filters.length > 0) {
            sql += ' WHERE ' + filters.join(' AND ');
        }

        sql += ' ORDER BY timestamp ASC';

        const rows = await this.db.all(sql, ...params);
        return rows.map(row => ({
            latitude: row.latitude,
            longitude: row.longitude,
            timestamp: row.timestamp
        }));
    }

    async findUniqueDates(): Promise<string[]> {
        const sql = 'SELECT DISTINCT SUBSTR(timestamp, 1, 10) AS date FROM locations ORDER BY date ASC';
        const rows = await this.db.all(sql);
        return rows.map(row => row.date);
    }

    async findUniqueHoursByDate(date: string): Promise<string[]> {
        const sql = `
            SELECT DISTINCT SUBSTR(timestamp, 12, 2) AS hour
            FROM locations
            WHERE SUBSTR(timestamp, 1, 10) = ?
            ORDER BY hour ASC`;
        const rows = await this.db.all(sql, date);
        return rows.map(row => row.hour);
    }
}