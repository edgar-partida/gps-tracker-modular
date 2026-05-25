import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { SqliteLocationRepository } from './repositories/SqliteLocationRepository';
import { SaveLocationUseCase } from './use-cases/SaveLocationUseCase';
import { GetLocationsUseCase } from './use-cases/GetLocationsUseCase';
import { LocationController } from './controllers/LocationController';

const app = express();
app.use(express.json());

async function bootstrap() {
    // 1. Configure lightweight Database on startup
    console.log(`[${new Date().toISOString()}] [Bootstrap] Initializing database connection...`);
    const db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
    console.log(`[${new Date().toISOString()}] [Bootstrap] Database connection established.`);

    // 2. Setup Repository and Initialize Schema
    const locationRepo = new SqliteLocationRepository(db);
    await locationRepo.initialize();
    console.log(`[${new Date().toISOString()}] [Bootstrap] Location repository schema initialized.`);

    // 3. Setup Use Case and Controller (Dependency Injection)
    const saveLocationUseCase = new SaveLocationUseCase(locationRepo);
    const getLocationsUseCase = new GetLocationsUseCase(locationRepo);
    const locationController = new LocationController(saveLocationUseCase, getLocationsUseCase);

    // 4. Define Routes
    app.post('/api/locations', (req, res) => {
        console.log(`[${new Date().toISOString()}] [Network] POST /api/locations request received from ${req.ip}`);
        return locationController.save(req, res);
    });

    app.get('/api/locations', (req, res) => {
        console.log(`[${new Date().toISOString()}] [Network] GET /api/locations request received from ${req.ip}`);
        return locationController.get(req, res);
    });

    app.get('/api/dates', (req, res) => {
        console.log(`[${new Date().toISOString()}] [Network] GET /api/dates request received from ${req.ip}`);
        return locationController.getDates(req, res);
    });

    app.get('/api/hours', (req, res) => {
        console.log(`[${new Date().toISOString()}] [Network] GET /api/hours request received from ${req.ip}`);
        return locationController.getHours(req, res);
    });

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

bootstrap().catch(err => {
    console.error(`[${new Date().toISOString()}] Failed to start server:`, err);
});