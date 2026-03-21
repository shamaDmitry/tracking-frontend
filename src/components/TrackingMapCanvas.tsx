import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer } from "react-leaflet";
import { io } from "socket.io-client";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useStore } from "../store/RootStore";
import { CanvasTrackerOverlay } from "./CanvasTrackerOverlay";

export const TrackingMapCanvas = observer(() => {
  const { mapStore } = useStore();

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to tracking server");
    });

    socket.on("object_update", (data) => {
      mapStore.handleBatchUpdate(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [mapStore]);

  const mapCenter: [number, number] = [50.4501, 30.5234];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CanvasTrackerOverlay />
      </MapContainer>
    </Box>
  );
});
