"use client";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import type { Location } from "@/lib/types/location";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

// Default marker icon fix for Leaflet in React
const defaultIcon = new L.Icon({
  iconUrl: "marker-icon.png",
  shadowUrl: "marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ShowPostLocation({
  address,
  location,
}: {
  location: Location;
  address: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-transparent">
          <u>{address}</u>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
          <DialogDescription>{address}</DialogDescription>
        </DialogHeader>
        <MapContainer
          center={{
            lng: location.coordinates[0],
            lat: location.coordinates[1],
          }}
          zoom={16}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={{
              lng: location.coordinates[0],
              lat: location.coordinates[1],
            }}
            icon={defaultIcon}
          />
        </MapContainer>
      </DialogContent>
    </Dialog>
  );
}
