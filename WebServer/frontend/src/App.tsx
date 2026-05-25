import React, { useState, useMemo } from 'react';
import { useLocations } from './hooks/useLocations';
import { LocationDetails } from './components/locationDetails';
import { MapView } from './components/mapView';

function App() {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const {
        loading,
        data,
        error,
        availableDates,
        selectedDate,
        handleDateChange,
        availableHours,
        selectedHour,
        handleHourChange,
        pagedData,
        loadMore,
        loadAll,
        hasMore,
        totalCount
    } = useLocations();

    // Calcular distancia total del tramo visible
    const totalDistance = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.distanceFromPrevious, 0);
    }, [data]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900">Tracker de Localizaciones</h1>
                    <p className="mt-2 text-gray-600">Filtra la información por día y hora</p>
                </header>

                <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Día Disponible</label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border"
                                onChange={(e) => handleDateChange(e.target.value)}
                                value={selectedDate}
                                disabled={availableDates.length === 0 && !loading}
                            >
                                <option value="" disabled>
                                    {loading && !selectedDate ? "Cargando días..." : "Selecciona un día..."}
                                </option>
                                {availableDates.map(date => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Hora</label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border disabled:bg-gray-100 disabled:text-gray-400"
                                disabled={!selectedDate || availableHours.length === 0 || loading}
                                value={selectedHour}
                                onChange={(e) => handleHourChange(e.target.value)}
                            >
                                <option value="">Todas las horas</option>
                                {availableHours.map(hour => (
                                    <option key={hour} value={hour}>{hour}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                            Error: {error}
                        </div>
                    )}

                    {data.length > 0 && !loading && (
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                <strong>{totalCount}</strong> puntos | <strong>{(totalDistance / 1000).toFixed(2)} km</strong> totales
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Mapa
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Lista
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contenido Principal */}
                <div className="mt-8">
                    {viewMode === 'map' && data.length > 0 && (
                        <MapView locations={data} />
                    )}

                    {viewMode === 'list' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pagedData.map((item, index) => (
                                    <LocationDetails key={`${item.timestamp}-${index}`} location={item} />
                                ))}
                            </div>

                            {hasMore && !loading && (
                                <div className="mt-8 flex justify-center space-x-4">
                                    <button
                                        onClick={loadMore}
                                        className="px-6 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition"
                                    >
                                        Cargar más (100)
                                    </button>
                                    <button
                                        onClick={loadAll}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                                    >
                                        Cargar todo
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {data.length === 0 && !loading && (
                    <div className="mt-10 text-center text-gray-400 italic">
                        Selecciona una fecha y una hora para ver los detalles.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
