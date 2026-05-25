import { LocationData } from '../types/location';

const API_BASE_URL = '/api'; // Usando el proxy de Vite

export const locationService = {
  /**
   * Obtiene las localizaciones para una fecha y hora específica desde el backend.
   */
  async fetchLocations(date: string, hour?: string): Promise<LocationData[]> {
    let url = `${API_BASE_URL}/locations?date=${date}`;
    if (hour) {
      // La API espera la hora en formato "HH", no "HH:MM"
      url += `&hour=${hour.split(':')[0]}`;
    }
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obtiene todos los días disponibles con información desde el backend.
   */
  async fetchAvailableDates(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/dates`);
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Obtiene las horas disponibles para una fecha específica desde el backend.
   */
  async fetchAvailableHours(date: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/hours?date=${date}`);
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.statusText}`);
    }
    // La API devuelve ["00", "01"], lo formateamos a "00:00" para la UI
    return response.json().then((hours: string[]) => hours.map(h => `${h}:00`));
  }
};
