import { useState, useMemo, useEffect, useCallback } from 'react';
import { LocationData, LocationState } from '../types/location';
import { locationService } from '../services/locationService';

export const useLocations = () => {
  const [state, setState] = useState<LocationState>({
    data: [],
    loading: false,
    error: null,
  });

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableHoursForSelectedDate, setAvailableHoursForSelectedDate] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(100);
  const [selectedHour, setSelectedHour] = useState<string>("");

  // 1. Cargar las fechas disponibles al montar el componente
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates = await locationService.fetchAvailableDates();
        setAvailableDates(dates);
      } catch (err) {
        console.error("Error al obtener las fechas disponibles:", err);
        // Podrías manejar este error en la UI si es necesario
      }
    };
    fetchDates();
  }, []);

  // Función para obtener localizaciones del backend
  const fetchLocationsData = useCallback(async (date: string, hour?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await locationService.fetchLocations(date, hour);
      setState({ data, loading: false, error: null });
      setVisibleCount(100); // Reiniciar paginación cada vez que se cargan nuevos datos
    } catch (err) {
      setState({ data: [], loading: false, error: (err as Error).message });
    }
  }, []);

  // 2. Manejar la selección de fecha
  const handleDateChange = useCallback(async (date: string) => {
    setSelectedDate(date);
    setSelectedHour(""); // Resetear la hora al cambiar la fecha
    setAvailableHoursForSelectedDate([]); // Limpiar horas para la nueva fecha

    if (date) {
      // Obtener las horas disponibles para la fecha seleccionada
      try {
        const hours = await locationService.fetchAvailableHours(date);
        setAvailableHoursForSelectedDate(hours);
      } catch (err) {
        console.error("Error al obtener las horas disponibles:", err);
        setAvailableHoursForSelectedDate([]);
      }
      // Cargar las localizaciones para la fecha seleccionada (sin hora específica inicialmente)
      fetchLocationsData(date);
    } else {
      setState({ data: [], loading: false, error: null }); // Limpiar datos si no hay fecha seleccionada
    }
  }, [fetchLocationsData]);

  // 3. Manejar la selección de hora
  const handleHourChange = useCallback((hour: string) => {
    setSelectedHour(hour);
    if (selectedDate) {
      fetchLocationsData(selectedDate, hour);
    }
  }, [selectedDate, fetchLocationsData]);

  // Paginación de los datos cargados
  const pagedData = useMemo(() => state.data.slice(0, visibleCount), [state.data, visibleCount]);
  const hasMore = visibleCount < state.data.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 100);
  };

  const loadAll = () => {
    setVisibleCount(state.data.length);
  };

  return {
    ...state, // Contiene data, loading, error
    availableDates,
    selectedDate,
    handleDateChange,
    availableHours: availableHoursForSelectedDate, // Renombrado para claridad en App.tsx
    selectedHour,
    handleHourChange,
    pagedData,
    loadMore,
    loadAll,
    hasMore,
    totalCount: state.data.length, // totalCount ahora es el total de datos para la fecha/hora seleccionada
    visibleCount,
  };
};
