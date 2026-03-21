// components/CanvasTrackerOverlay.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { autorun } from "mobx";
import { useStore } from "../store/RootStore";

export const CanvasTrackerOverlay = () => {
  const { mapStore } = useStore();

  const map = useMap();

  useEffect(() => {
    const canvas = document.createElement("canvas");

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "400";

    // Mount canvas to the Leaflet container
    map.getContainer().appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // 2. The Core Drawing Function
    const draw = () => {
      if (!ctx) return;

      const size = map.getSize();

      if (canvas.width !== size.x || canvas.height !== size.y) {
        canvas.width = size.x;
        canvas.height = size.y;
      }

      // Clear the previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get current map bounds (Optimization: don't draw off-screen objects)
      const bounds = map.getBounds();

      mapStore.points.forEach((obj) => {
        if (!bounds.contains([obj.lat, obj.lng])) return;

        // Convert the Lat/Lng to exact X/Y pixels on your screen
        const point = map.latLngToContainerPoint([obj.lat, obj.lng]);

        ctx.save();

        // Move the canvas origin to the object's X/Y coordinate
        ctx.translate(point.x, point.y);

        // Rotate the canvas (Canvas uses radians, so we convert from degrees)
        ctx.rotate((obj.direction * Math.PI) / 180);

        // 3. Draw the directional arrow
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(8, 12);
        ctx.lineTo(0, 6);
        ctx.lineTo(-8, 12);
        ctx.closePath();
        ctx.fillStyle =
          obj.status === "lost" ? "rgba(244, 67, 54, 0.5)" : "#4caf50";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        ctx.restore();
      });
    };

    // 4. Trigger redraws on Map movement and MobX updates
    map.on("move", draw);
    map.on("zoom", draw);

    // MobX autorun will automatically fire 'draw' whenever mapStore.objectsList changes
    const cleanupMobx = autorun(() => {
      draw();
    });

    // Initial draw
    draw();

    // 5. Cleanup on unmount
    return () => {
      map.off("move", draw);
      map.off("zoom", draw);

      cleanupMobx();

      map.getContainer().removeChild(canvas);
    };
  }, [map, mapStore.points]);

  return null;
};
