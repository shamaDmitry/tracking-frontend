import type { MapStore } from "../store/MapStore";

export const findObjectAtMouse = (
  e: L.LeafletMouseEvent,
  map: L.Map,
  mapStore: MapStore,
) => {
  const HIT_RADIUS = 15;
  const mousePoint = map.mouseEventToContainerPoint(e.originalEvent);

  let foundId: string | null = null;

  for (const obj of mapStore.objectsList) {
    const objPoint = map.latLngToContainerPoint([obj.lat, obj.lng]);

    // Pythagorean theorem to find the pixel distance between mouse and object
    const distance = Math.sqrt(
      Math.pow(mousePoint.x - objPoint.x, 2) +
        Math.pow(mousePoint.y - objPoint.y, 2),
    );

    if (distance <= HIT_RADIUS) {
      foundId = obj.id;

      break;
    }
  }
  return foundId;
};
