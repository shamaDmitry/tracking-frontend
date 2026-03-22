import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { autorun } from "mobx";
import { useStore } from "../store/RootStore";
import { red, blue, orange } from "@mui/material/colors";
import { findObjectAtMouse } from "../helpers/findObjectAtMouse";

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

    map.getContainer().appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      const hovered = findObjectAtMouse(e, map, mapStore);

      if (hovered !== mapStore.hoveredId) {
        mapStore.setHovered(hovered);

        map.getContainer().style.cursor = hovered ? "pointer" : "grab";
      }
    };

    const handleMouseClick = (e: L.LeafletMouseEvent) => {
      const clicked = findObjectAtMouse(e, map, mapStore);

      mapStore.setSelected(clicked);
    };

    map.on("mousemove", handleMouseMove);
    map.on("click", handleMouseClick);

    const draw = () => {
      if (!ctx) return;

      const size = map.getSize();

      if (canvas.width !== size.x || canvas.height !== size.y) {
        canvas.width = size.x;
        canvas.height = size.y;
      }

      // Clear the previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bounds = map.getBounds();

      mapStore.points.forEach((obj) => {
        if (!bounds.contains([obj.lat, obj.lng])) return;

        const point = map.latLngToContainerPoint([obj.lat, obj.lng]);
        const isHovered = mapStore.hoveredId === obj.id;
        const isSelected = mapStore.selectedId === obj.id;

        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.rotate((obj.direction * Math.PI) / 180);

        const scale = isHovered || isSelected ? 1.3 : 1;
        ctx.scale(scale, scale);

        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(8, 12);
        ctx.lineTo(0, 6);
        ctx.lineTo(-8, 12);
        ctx.closePath();
        ctx.fillStyle = obj.status === "lost" ? `${red[500]}` : `${blue[500]}`;
        ctx.fill();

        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? orange[500] : "#fff";
        ctx.stroke();

        ctx.restore();
      });
    };

    map.on("move", draw);
    map.on("zoom", draw);

    const cleanupMobx = autorun(() => {
      draw();
    });

    // Initial draw
    draw();

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("click", handleMouseClick);
      map.off("move", draw);
      map.off("zoom", draw);

      cleanupMobx();

      map.getContainer().removeChild(canvas);
    };
  }, [map, mapStore.points, mapStore]);

  return null;
};
