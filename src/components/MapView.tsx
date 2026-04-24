import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Mechanic } from '@/services/api';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(37,99,235,0.6);animation:pulse-dot 2s ease-in-out infinite"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface Coords {
  lat: number;
  lng: number;
}

function RecenterMap({ coords }: { coords: Coords | null }) {
  const map = useMap();
  if (coords) map.setView([coords.lat, coords.lng], 14);
  return null;
}

interface MapViewProps {
  userLocation: Coords | null;
  mechanics: Mechanic[];
  onSelectMechanic?: (m: Mechanic) => void;
}

export default function MapView({ userLocation, mechanics, onSelectMechanic }: MapViewProps) {
  const center = userLocation || { lat: 19.07, lng: 72.87 };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden card-shadow">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {mechanics.map((m) => (
          <Marker
            key={m.id}
            position={[m.location.y, m.location.x]}
            icon={DefaultIcon}
            eventHandlers={{ click: () => onSelectMechanic?.(m) }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <RecenterMap coords={userLocation} />
      </MapContainer>
    </div>
  );
}
