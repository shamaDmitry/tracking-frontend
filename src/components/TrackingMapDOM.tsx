import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Box, Typography, Chip } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useStore } from "../store/RootStore";
import { red, blue } from "@mui/material/colors";
import { type PointObject } from "../store/MapStore";

const createCustomIcon = (direction: number, status: "active" | "lost") => {
  const color = status === "lost" ? red[500] : blue[500];
  const opacity = status === "lost" ? 0.5 : 1;

  return L.divIcon({
    className: "",
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
        cursor: pointer;
      ">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px" stroke="white" stroke-width="1.5" style="display: block;">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const TrackerMarker = observer(({ obj }: { obj: PointObject }) => {
  const icon = useMemo(
    () => createCustomIcon(obj.direction, obj.status),
    [obj.direction, obj.status],
  );

  return (
    <Marker position={[obj.lat, obj.lng]} icon={icon}>
      <Popup>
        <Box sx={{ p: 0, width: 200 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Object ID: {obj.id}
          </Typography>

          <Typography variant="subtitle1">
            Direction: {obj.direction}°
          </Typography>

          <Typography variant="subtitle1">Lat: {obj.lat.toFixed(5)}</Typography>

          <Typography variant="subtitle1">Lng: {obj.lng.toFixed(5)}</Typography>

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
});

export const TrackingMapDOM = observer(() => {
  const { mapStore } = useStore();
  const mapCenter: [number, number] = [50.4501, 30.5234];

  return (
    <Box sx={{ height: "100%", width: "100%", boxSizing: "border-box" }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapStore.objectsList.map((obj) => (
          <TrackerMarker key={obj.id} obj={obj} />
        ))}
      </MapContainer>
    </Box>
  );
});
