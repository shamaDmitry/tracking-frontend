import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import { CanvasTrackerOverlay } from "./CanvasTrackerOverlay";
import { useStore } from "../store/RootStore";
import CloseIcon from "@mui/icons-material/Close";

export const TrackingMapCanvas = observer(() => {
  const mapCenter: [number, number] = [50.4501, 30.5234];

  const { mapStore } = useStore();

  const selectedObject = mapStore.selectedId
    ? mapStore.points.get(mapStore.selectedId)
    : null;

  return (
    <Box
      sx={{
        position: "relative",
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

      {selectedObject && (
        <Card
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
            width: 250,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Object Details</Typography>

              <IconButton
                size="small"
                onClick={() => mapStore.setSelected(null)}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>ID:</strong>

              <Typography component="span" sx={{ fontWeight: "bold", ml: 1 }}>
                {selectedObject.id}
              </Typography>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong>

              <Chip
                sx={{ ml: 1 }}
                size="small"
                label={selectedObject.status.toUpperCase()}
                color={selectedObject.status === "lost" ? "error" : "success"}
              />
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Direction:</strong>

              <Typography component="span" sx={{ fontWeight: "bold", ml: 1 }}>
                {selectedObject.direction}°
              </Typography>
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", flexDirection: "column", mt: 1 }}
            >
              <strong>Coordinates:</strong>

              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {selectedObject.lat.toFixed(4)}, {selectedObject.lng.toFixed(4)}
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
});
