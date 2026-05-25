import { Location } from "../domain/Location";

export interface ILocationRepository {
    save(location: Location): Promise<void>;
    findByDate(date?: string, hour?: string): Promise<Location[]>;
    findUniqueDates(): Promise<string[]>;
    findUniqueHoursByDate(date: string): Promise<string[]>;
    initialize(): Promise<void>;
}