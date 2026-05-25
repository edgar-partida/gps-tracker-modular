import { Location } from "../domain/Location";
import { ILocationRepository } from "../repositories/ILocationRepository";

export class SaveLocationUseCase {
    constructor(private locationRepository: ILocationRepository) { }
    // Helper to get local time if none provided
    async execute(lat: number, lng: number, timestamp?: string): Promise<void> {
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new Error("Invalid coordinates");
        }

        const location: Location = {
            latitude: lat,
            longitude: lng,
            timestamp: timestamp || this.getLocalNow()
        };

        await this.locationRepository.save(location);
    }

    private getLocalNow(): string {
        const date = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
}