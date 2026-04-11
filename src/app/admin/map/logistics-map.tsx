'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, X, Navigation } from 'lucide-react';
import { saveBuyerLocation } from '../actions';
import { useRouter } from 'next/navigation';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Map clamped to Pangasinan
const pangasinanCenter = { lat: 15.8949, lng: 120.2863 };
const pangasinanBounds = {
  north: 16.5,
  south: 15.2,
  east: 120.9,
  west: 119.7,
};

export type BuyerLocation = {
  id: string;
  name: string;
  description: string;
  landmark: string | null;
  latitude: number;
  longitude: number;
  created_at?: string;
};

export type LiveRider = {
  id: string;
  full_name: string;
  rider_statuses?: {
    latitude: number;
    longitude: number;
    status: string;
    updated_at: string;
  } | null;
};

interface LogisticsMapProps {
  initialLocations: BuyerLocation[];
  liveRiders: LiveRider[];
}

export function LogisticsMap({ initialLocations, liveRiders }: LogisticsMapProps) {
  const router = useRouter();
  
  const [locations] = useState<BuyerLocation[]>(initialLocations);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number, lng: number } | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<BuyerLocation | null>(null);
  const [selectedRider, setSelectedRider] = useState<LiveRider | null>(null);
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setSelectedLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setIsModalOpen(true);
      setError('');
    }
  }, []);

  async function handlePinSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedLatLng) return;
    
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('latitude', selectedLatLng.lat.toString());
    formData.append('longitude', selectedLatLng.lng.toString());
    
    const response = await saveBuyerLocation(formData);
    
    if (response?.error) {
       setError(response.error);
       setIsSubmitting(false);
    } else {
       setIsModalOpen(false);
       setSelectedLatLng(null);
       setIsSubmitting(false);
       router.refresh(); 
    }
  }

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

  const mapOptions = {
     restriction: {
       latLngBounds: pangasinanBounds,
       strictBounds: false,
     },
     styles: [
       { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
       { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
       { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
       { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
       { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
       { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
       { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
       { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
       { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
       { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
       { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
       { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
       { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
       { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
       { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
       { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
     ],
     disableDefaultUI: false,
     zoomControl: true,
  };

  const getRiderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return '#4ade80'; // Green
      case 'busy': return '#ef4444'; // Red
      case 'delivering': return '#ef4444'; // Red
      default: return '#737373'; // Gray/Offline
    }
  }

  const activeRiders = liveRiders.filter(r => r.rider_statuses?.latitude && r.rider_statuses?.longitude)

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pangasinanCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={mapOptions}
      >
        {/* Render persistent DB Buyer locations */}
        {initialLocations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={{ lat: loc.latitude, lng: loc.longitude }} 
            onClick={() => { setSelectedLocation(loc); setSelectedRider(null); }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#fb7185',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 8
            }}
          />
        ))}

        {/* Render live Riders */}
        {activeRiders.map((rider) => (
          <Marker 
            key={rider.id}
            position={{ lat: rider.rider_statuses!.latitude, lng: rider.rider_statuses!.longitude }}
            onClick={() => { setSelectedRider(rider); setSelectedLocation(null); }}
            icon={{
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              fillColor: getRiderColor(rider.rider_statuses!.status),
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#fff',
              rotation: 45,
              scale: 6
            }}
          />
        ))}

        {/* Temporary drop pin */}
        {selectedLatLng && isModalOpen && (
           <Marker 
             position={selectedLatLng}
             icon={{
               path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
               fillColor: '#a855f7', // Purple for temporary
               fillOpacity: 1,
               strokeWeight: 1,
               strokeColor: '#ffffff',
               scale: 6
             }}
           />
        )}

        {/* InfoWindow for existing buyer pins */}
        {selectedLocation && (
          <InfoWindow position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }} onCloseClick={() => setSelectedLocation(null)}>
            <div className="text-black p-2 min-w-[200px]">
              <h3 className="font-bold text-sm text-[#242f3e] mb-1">{selectedLocation.name}</h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">{selectedLocation.description}</p>
              {selectedLocation.landmark && (
                <p className="text-[10px] text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3 h-3 opacity-50" />
                  {selectedLocation.landmark}
                </p>
              )}
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for Rider details */}
        {selectedRider && selectedRider.rider_statuses && (
          <InfoWindow position={{ lat: selectedRider.rider_statuses.latitude, lng: selectedRider.rider_statuses.longitude }} onCloseClick={() => setSelectedRider(null)}>
            <div className="text-black p-2 min-w-[180px]">
              <h3 className="font-bold text-sm text-[#242f3e] mb-1 flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-blue-500" />
                {selectedRider.full_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiderColor(selectedRider.rider_statuses.status) }} />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{selectedRider.rider_statuses.status}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Last Updated: {new Date(selectedRider.rider_statuses.updated_at).toLocaleTimeString()}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* HUD Info */}
      <div className="absolute top-4 left-4 right-4 max-w-sm bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
        <h3 className="text-white text-sm font-semibold mb-1">Live Hub: Pangasinan</h3>
        <p className="text-white/60 text-xs mb-3">Map boundaries are locked to the province. Click anywhere to add a Drop.</p>
        <div className="flex gap-2 text-xs">
          <div className="bg-white/10 px-2 py-1 rounded text-white/80">
            Saved Drops: {initialLocations.length}
          </div>
          <div className="bg-white/10 px-2 py-1 rounded text-white/80 shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Active Fleet: {activeRiders.length}
          </div>
        </div>
      </div>

      {/* Floating Add Modal */}
      {isModalOpen && selectedLatLng && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-[#1a1512]/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-5 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Pin Buyer Location</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {error && <div className="text-xs bg-red-500/10 text-red-400 p-2 rounded mb-3 border border-red-500/20">{error}</div>}

          <form onSubmit={handlePinSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Buyer Name *</label>
              <input name="name" required autoFocus className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-accent" placeholder="e.g. John Doe" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Description *</label>
              <textarea name="description" required className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-accent resize-none h-16" placeholder="Delivery instructions..."></textarea>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Landmark (Optional)</label>
              <input name="landmark" className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white outline-none focus:border-accent" placeholder="Near the blue gate" />
            </div>
            
            <div className="flex gap-2 mb-2">
               <input disabled value={selectedLatLng.lat.toFixed(5)} className="w-1/2 bg-white/5 border border-white/5 rounded p-1.5 text-[10px] text-white/40 cursor-not-allowed" />
               <input disabled value={selectedLatLng.lng.toFixed(5)} className="w-1/2 bg-white/5 border border-white/5 rounded p-1.5 text-[10px] text-white/40 cursor-not-allowed" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-accent hover:bg-accent/80 text-background font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
              {isSubmitting ? 'Saving Base...' : <><MapPin className="w-4 h-4"/> Save Pin</>}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
