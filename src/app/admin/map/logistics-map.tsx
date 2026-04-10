'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center: arbitrary coords, could be modified to base store location
const defaultCenter = {
  lat: 14.5995, 
  lng: 120.9842
};

export function LogisticsMap() {
  const [markers, setMarkers] = useState([{ id: 1, position: defaultCenter, label: "HQ" }]);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkers((current) => [
        ...current,
        {
          id: Date.now(),
          position: { lat: e.latLng!.lat(), lng: e.latLng!.lng() },
          label: "Drop"
        }
      ]);
    }
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-xl text-white/50 p-6 text-center">
        <MapPin className="w-8 h-8 mb-3 opacity-20" />
        <p>Google Maps API key is missing or invalid.</p>
        <p className="text-xs mt-2 opacity-50">Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/5 animate-pulse rounded-xl border border-white/5">
         <span className="text-white/40 text-sm">Loading map interface...</span>
      </div>
    );
  }

  // Uses a dark styled map via options to match the dashboard theme
  const mapOptions = {
     styles: [
       { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
       { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
       { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
       {
         featureType: "administrative.locality",
         elementType: "labels.text.fill",
         stylers: [{ color: "#d59563" }],
       },
       {
         featureType: "poi",
         elementType: "labels.text.fill",
         stylers: [{ color: "#d59563" }],
       },
       {
         featureType: "poi.park",
         elementType: "geometry",
         stylers: [{ color: "#263c3f" }],
       },
       {
         featureType: "poi.park",
         elementType: "labels.text.fill",
         stylers: [{ color: "#6b9a76" }],
       },
       {
         featureType: "road",
         elementType: "geometry",
         stylers: [{ color: "#38414e" }],
       },
       {
         featureType: "road",
         elementType: "geometry.stroke",
         stylers: [{ color: "#212a37" }],
       },
       {
         featureType: "road",
         elementType: "labels.text.fill",
         stylers: [{ color: "#9ca5b3" }],
       },
       {
         featureType: "road.highway",
         elementType: "geometry",
         stylers: [{ color: "#746855" }],
       },
       {
         featureType: "road.highway",
         elementType: "geometry.stroke",
         stylers: [{ color: "#1f2835" }],
       },
       {
         featureType: "road.highway",
         elementType: "labels.text.fill",
         stylers: [{ color: "#f3d19c" }],
       },
       {
         featureType: "water",
         elementType: "geometry",
         stylers: [{ color: "#17263c" }],
       },
       {
         featureType: "water",
         elementType: "labels.text.fill",
         stylers: [{ color: "#515c6d" }],
       },
       {
         featureType: "water",
         elementType: "labels.text.stroke",
         stylers: [{ color: "#17263c" }],
       },
     ],
     disableDefaultUI: false,
     zoomControl: true,
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={mapOptions}
      >
        {/* Render interactive markers */}
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position} 
            label={{ text: marker.label, color: 'white', fontSize: '10px' }} 
          />
        ))}
        <></>
      </GoogleMap>
      
      <div className="absolute top-4 left-4 right-4 max-w-sm bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
        <h3 className="text-white text-sm font-semibold mb-1">Live Tracking Node (Active)</h3>
        <p className="text-white/60 text-xs mb-3">Click anywhere on the map to drop a temporary pin. Connection to backend API is ready.</p>
        <div className="flex gap-2 text-xs">
          <div className="bg-white/10 px-2 py-1 rounded text-white/80">
            Active Riders: 0
          </div>
          <div className="bg-white/10 px-2 py-1 rounded text-white/80">
            Pending Drops: {markers.length - 1}
          </div>
        </div>
      </div>
    </div>
  );
}
