import { DistanceCalculator } from './DistanceCalculator';
import { ILocationRepository } from '../repositories/ILocationRepository';
import { Location } from '../domain/Location';

export class GetLocationsUseCase {
    constructor(private locationRepo: ILocationRepository) { }

    async execute(date?: string, hour?: string): Promise<(Location & { distanceFromPrevious: number })[]> {
        const locations = await this.locationRepo.findByDate(date, hour);

        return locations.map((loc: Location, index: number) => {
            let distanceFromPrevious = 0;
            if (index > 0) {
                const prev = locations[index - 1];
                distanceFromPrevious = DistanceCalculator.calculate(
                    prev.latitude, prev.longitude,
                    loc.latitude, loc.longitude
                );
            }
            return { ...loc, distanceFromPrevious };
        });
    }

    async getUniqueDates(): Promise<string[]> {
        return this.locationRepo.findUniqueDates();
    }

    async getUniqueHoursByDate(date: string): Promise<string[]> {
        return this.locationRepo.findUniqueHoursByDate(date);
    }
}