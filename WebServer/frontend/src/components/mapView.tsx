import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { LocationData } from '../types/location';
import L from 'leaflet';

// Fix for Leaflet default marker icons in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
    locations: LocationData[];
}

// Componente para centrar el mapa cuando cambian los datos
const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center);
    return null;
};

export const MapView: React.FC<Props> = ({ locations }) => {
    if (locations.length === 0) return null;

    const path = locations.map(loc => [loc.latitude, loc.longitude] as [number, number]);
    const center = path[0];

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200">
            <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <ChangeView center={center} />
                <Polyline positions={path} color="blue" weight={4} opacity={0.7} />
                <Marker position={path[0]}>
                    <Popup>Inicio del tramo</Popup>
                </Marker>
                <Marker position={path[path.length - 1]}>
                    <Popup>Fin del tramo</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};