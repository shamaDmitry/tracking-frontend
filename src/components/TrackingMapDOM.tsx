import { useMemo, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Box, Typography, Chip } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useStore } from "../store/RootStore";
import { red, blue } from "@mui/material/colors";
import { type PointObject } from "../store/MapStore";

const TrackerMarker = observer(({ obj }: { obj: PointObject }) => {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);

  const icon = useMemo(() => {
    return L.divIcon({
      className: "tracker-marker-container",
      html: `
        <div class="tracker-hitbox" style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          cursor: pointer;
        ">
          <div class="tracker-icon-visual" style="
            color: ${obj.status === "lost" ? red[500] : blue[500]};
            opacity: ${obj.status === "lost" ? 0.5 : 1};
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            transition: color 0.3s, opacity 0.3s;
          ">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px" stroke="white" stroke-width="1.5">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }, []);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const container = marker.getElement();
    if (!container) return;

    const point = map.latLngToLayerPoint([obj.lat, obj.lng]);

    container.style.transition = "transform 0.1s linear";
    container.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;

    const visual = container.querySelector(
      ".tracker-icon-visual",
    ) as HTMLElement;
    if (visual) {
      visual.style.transform = `rotate(${obj.direction}deg)`;
      visual.style.color = obj.status === "lost" ? red[500] : blue[500];
      visual.style.opacity = obj.status === "lost" ? "0.5" : "1";
    }

    if (marker.isPopupOpen()) {
      marker.setLatLng([obj.lat, obj.lng]);
    }
  }, [obj.lat, obj.lng, obj.direction, obj.status, map]);

  return (
    <Marker ref={markerRef} position={[obj.lat, obj.lng]} icon={icon}>
      <Popup autoPan={false} closeButton={false}>
        <Box sx={{ p: 0, width: 180 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            ID: {obj.id}
          </Typography>
          <Typography variant="subtitle1" display="block">
            Dir: {obj.direction}°
          </Typography>

          <Typography variant="subtitle1">Lat: {obj.lat.toFixed(5)}</Typography>

          <Typography variant="subtitle1">Lng: {obj.lng.toFixed(5)}</Typography>

          <Chip
            size="small"
            label={obj.status.toUpperCase()}
            color={obj.status === "lost" ? "error" : "success"}
            sx={{ mt: 0.5, height: 20, fontSize: "0.65rem" }}
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
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mapStore.objectsList.map((obj) => (
          <TrackerMarker key={obj.id} obj={obj} />
        ))}
      </MapContainer>
    </Box>
  );
});
