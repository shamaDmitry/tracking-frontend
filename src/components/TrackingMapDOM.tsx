import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import { Box, Typography, Chip } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useStore } from "../store/RootStore";

const createCustomIcon = (direction: number, status: "active" | "lost") => {
  const color = status === "lost" ? "#f44336" : "#4caf50";
  const opacity = status === "lost" ? 0.5 : 1;

  return L.divIcon({
    className: "custom-tracker-icon",
    html: `
      <div style="
        transform: rotate(${direction}deg);
        color: ${color};
        opacity: ${opacity};
        transition: transform 0.3s ease, opacity 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
      ">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px" stroke="white" stroke-width="1.5">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [12, 0],
  });
};

export const TrackingMapDOM = observer(() => {
  const { mapStore } = useStore();

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
    );

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
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        pl: 4,
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

        {mapStore.objectsList.map((obj) => {
          return (
            <Marker
              key={obj.id}
              position={[obj.lat, obj.lng]}
              icon={createCustomIcon(obj.direction, obj.status)}
            >
              <Popup>
                <Box sx={{ p: 0, width: 200 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Object ID: {obj.id}
                  </Typography>

                  <Typography variant="subtitle1">
                    Direction: {obj.direction}
                  </Typography>

                  <Typography variant="subtitle1">
                    Lat: {obj.lat.toFixed(5)}
                  </Typography>

                  <Typography variant="subtitle1">
                    Lng: {obj.lng.toFixed(5)}
                  </Typography>

                  <Chip
                    size="small"
                    label={obj.status.toUpperCase()}
                    color={obj.status === "lost" ? "error" : "success"}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
});
