"use client";
import { AddLocationProps } from "@/lib/types/add-location-props";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LoadingOverlay } from "./loading-overlay";

// Default marker icon fix for Leaflet in React
const defaultIcon = new L.Icon({
  iconUrl: "marker-icon.png",
  shadowUrl: "marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function AddLocation(addLocationProps: AddLocationProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [locateMe, setLocateMe] = useState<boolean>(true);
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation && locateMe) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`detecting location. time: ${new Date().toISOString()}`);
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Location Permission Denied, Cannot Post");
          }
        }
      );
    }
    setLocateMe(false);
  }, [locateMe]);

  // Component to recenter map when position changes
  function RecenterMap({
    position,
  }: {
    position: { lat: number; lng: number };
  }) {
    const map = useMap();
    useEffect(() => {
      map.setView(position, map.getZoom());
    }, [position, map]);
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
      },
    });

    return position ? <Marker position={position} icon={defaultIcon} /> : null;
  }

  async function doPost() {
    setLoading(true);
    await addLocationProps.onSubmit(position.lat, position.lng, state, city);
    setLoading(false);
  }
  return (
    <LoadingOverlay visible={loading} message="Posting...">
      <div className="flex flex-col space-y-2 items-center h-full overflow-y-auto scroll-smooth">
        <MapContainer
          center={position}
          zoom={17}
          className="rounded-b-3xl"
          style={{ height: "68.75%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap position={position} />
          {/* Recenter when position updates */}
          <LocationMarker />
        </MapContainer>
        <div className="flex flex-row items-end space-x-2 px-2">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              value={position.lat}
              onChange={(e) =>
                setPosition({ ...position, lat: parseFloat(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              value={position.lng}
              onChange={(e) =>
                setPosition({ ...position, lng: parseFloat(e.target.value) })
              }
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className=""
            onClick={() => setLocateMe(true)}
          >
            <LocateFixed />
          </Button>
        </div>
        <div className="flex flex-row items-end space-x-2 px-2">
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">City</Label>
            <Input
              id="state"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <Button
          className="w-14/15 rounded-3xl bg-primaryButton text-primary-foreground"
          onClick={doPost}
          disabled={loading}
        >
          Post
        </Button>
      </div>
    </LoadingOverlay>
  );
}
