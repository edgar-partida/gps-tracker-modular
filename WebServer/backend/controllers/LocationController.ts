import { Request, Response } from 'express';
import { SaveLocationUseCase } from '../use-cases/SaveLocationUseCase';
import { GetLocationsUseCase } from '../use-cases/GetLocationsUseCase';

// Helper to get local time as YYYY-MM-DDTHH:mm:ss
const formatLocalTime = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export class LocationController {
    constructor(
        private saveLocationUseCase: SaveLocationUseCase,
        private getLocationsUseCase: GetLocationsUseCase
    ) { }

    async save(req: Request, res: Response) {
        // Try to use the gateway provided time, otherwise use server time
        const rawTime = req.body.timestamp || req.body.time;
        const dateObj = rawTime ? new Date(rawTime) : new Date();
        const logTime = formatLocalTime(dateObj);

        console.log(`[${logTime}] [Controller] Incoming payload:`, JSON.stringify(req.body));

        try {
            const { latitude, longitude } = req.body;

            if (latitude === undefined || longitude === undefined) {
                console.warn(`[${logTime}] [Controller] Validation Error: Missing coordinates in payload.`);
                return res.status(400).json({ error: "Missing latitude or longitude" });
            }

            console.log(`[${logTime}] [Controller] Saving location: Lat ${latitude}, Lon ${longitude}`);

            await this.saveLocationUseCase.execute(Number(latitude), Number(longitude), logTime);

            console.log(`[${logTime}] [Controller] Location persisted successfully.`);
            return res.status(201).json({ message: "Location saved successfully" });
        } catch (error: any) {
            console.error(`[${logTime}] [Controller] Unexpected error processing request:`, error);
            return res.status(500).json({ error: error.message });
        }
    }

    async get(req: Request, res: Response) {
        const receivedAt = formatLocalTime(new Date());
        try {
            const { date, hour } = req.query;
            const locations = await this.getLocationsUseCase.execute(
                date ? String(date) : undefined,
                hour ? String(hour) : undefined
            );
            return res.status(200).json(locations);
        } catch (error: any) {
            console.error(`[${receivedAt}] [Controller] Error fetching locations:`, error);
            return res.status(500).json({ error: error.message });
        }
    }

    async getDates(req: Request, res: Response) {
        const receivedAt = formatLocalTime(new Date());
        console.log(`[${receivedAt}] [Controller] GET /api/dates request received from ${req.ip}`);
        try {
            const dates = await this.getLocationsUseCase.getUniqueDates();
            console.log(`[${receivedAt}] [Controller] Returning unique dates: ${JSON.stringify(dates)}`);
            return res.status(200).json(dates);
        } catch (error: any) {
            console.error(`[${receivedAt}] [Controller] Error fetching unique dates:`, error);
            return res.status(500).json({ error: error.message });
        }
    }

    async getHours(req: Request, res: Response) {
        const receivedAt = formatLocalTime(new Date());
        const { date } = req.query;
        console.log(`[${receivedAt}] [Controller] GET /api/hours?date=${date} request received from ${req.ip}`);
        try {
            if (!date) return res.status(400).json({ error: "Date parameter is required (YYYY-MM-DD)" });
            const hours = await this.getLocationsUseCase.getUniqueHoursByDate(String(date));
            console.log(`[${receivedAt}] [Controller] Returning unique hours for date ${date}: ${JSON.stringify(hours)}`);
            return res.status(200).json(hours);
        } catch (error: any) {
            console.error(`[${receivedAt}] [Controller] Error fetching unique hours:`, error);
            return res.status(500).json({ error: error.message });
        }
    }
}