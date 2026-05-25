import React from 'react';
import { LocationData } from '../types/location';

interface Props {
    location: LocationData;
}

export const LocationDetails: React.FC<Props> = ({ location }) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-md font-bold text-blue-800 mb-2">Punto de Localización</h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="space-y-2">
                    <p><span className="font-semibold text-gray-600">Latitud:</span> {location.latitude}</p>
                    <p><span className="font-semibold text-gray-600">Longitud:</span> {location.longitude}</p>
                    <p><span className="font-semibold text-gray-600">Distancia tramo:</span> {location.distanceFromPrevious.toFixed(2)}m</p>
                </div>
                <div className="space-y-2">
                    <p><span className="font-semibold text-gray-600">Timestamp:</span> {new Date(location.timestamp).toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6">
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Ver en Google Maps
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
        </div>
    );
};
