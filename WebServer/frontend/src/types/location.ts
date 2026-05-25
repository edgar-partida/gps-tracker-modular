export interface LocationData {
    latitude: number;
    longitude: number;
    timestamp: string; // Formato ISO: "2026-05-25T14:30:00Z"
    distanceFromPrevious: number;
}

export interface LocationState {
    data: LocationData[];
    loading: boolean;
    error: string | null;
}
