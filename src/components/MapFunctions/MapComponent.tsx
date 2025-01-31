import { useCallback, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsLoader';
import '../../styles/components/MapComponent.scss';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const initialRegion = {
  latitude: -36.133852565671226,
  longitude: -72.79750640571565,
  latitudeDelta: 0.035,
  longitudeDelta: 0.02,
};

const MAP_ID = import.meta.env.VITE_API_MAP_ID;
interface MapComponentProps {
  center: { lat: number; lng: number }|undefined;
  zoom: number|undefined;
  markerPosition: { lat: number; lng: number }|undefined;
  onLocationChange: (lat: number, lng: number) => void;
  editMode: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, markerPosition, onLocationChange, editMode  }) => {

// const MapComponent = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [position, setPosition] = useState({ lat: center? center?.lat :initialRegion.latitude , lng: center? center?.lng :initialRegion.longitude });
  const [advancedMarker, setAdvancedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  // console.log("imprimiendo la posicion",advancedMarker?.position);
  console.log("Posición actualizada:", markerPosition);
  
  useEffect(() => {
  
    if (map && isLoaded ) {
      if (advancedMarker) {
        // Eliminar el marcador actual del mapa antes de actualizar su posición
        advancedMarker.map = null;
        
        // Actualizar la posición del marcador existente
        advancedMarker.position = new google.maps.LatLng(position.lat, position.lng);
  
        // Asignar nuevamente el mapa al marcador para volver a mostrarlo
        advancedMarker.map = map;
      } else {
        // Si el marcador no existe, lo creamos
        const newAdvancedMarker = new google.maps.marker.AdvancedMarkerElement({
          position: new google.maps.LatLng(position.lat, position.lng),
          title: "Ubicación seleccionada",
          gmpDraggable: editMode,
        });
  
        // Listener para eventos de clic en el marcador
        newAdvancedMarker.addListener('click', ({ domEvent, latLng }: { domEvent: MouseEvent, latLng: google.maps.LatLng }) => {
          console.log("Marcador clicado en la posición:", latLng?.toJSON(), domEvent);
          // Lógica adicional aquí
        });
  
        // Listener para eventos de fin de arrastre
        newAdvancedMarker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (editMode) {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();
            if (lat && lng) {
              onLocationChange(lat, lng);
            }
          }
        });
  
        // Asignamos el nuevo marcador al mapa
        newAdvancedMarker.map = map;
        setAdvancedMarker(newAdvancedMarker);
      }
    }
  }, [map, position, advancedMarker, onLocationChange, isLoaded, editMode]);
  

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (editMode && e.latLng) { 
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setPosition({ lat, lng });
        onLocationChange(lat, lng);
      }
    },
    [editMode, onLocationChange]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    // Establecemos el ID del mapa (mapId) para los mapas vectoriales
    const options = {
      mapId: MAP_ID,
    };
    map.setOptions(options);
    setMap(map);
  }, []);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={zoom? zoom : 15}
        onLoad={onMapLoad}
        onClick={onMapClick}
      />
      
    </>
  ) : (
    <div>Loading map...</div>
  );
};

export default MapComponent;
